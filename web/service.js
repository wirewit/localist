web.app({
    fetch: function(resource, opts, cb){
        if (web.app.service[resource]){
            web.app.service[resource](opts, cb);
        }
    },
    service: {
        init: function(){
            web.app.data.localeCode = {};
        },
        projects: function(options, cb){
            $.getJSON("../_design/i18n/_view/resources?group_level=2", function(data){
                var projects = {},
                    project, name;
                for (var i in data.rows){
                    name = data.rows[i].key[0];
                    project = projects[name] || {
                        //name: name,
                        sources: 0,
                        total: 0,
                        locales: 0,
                        progress: 0
                    };
                    project.locales += 1;
                    project.total += data.rows[i].value;
                    project.sources = data.rows[i].value > project.sources ?
                                      data.rows[i].value : project.sources;
                    projects[name] = project;
                }
                var estimated=0, 
                    actual=0;
                web.app.data.projects = [];
                for (name in projects){
                    project = projects[name];
                    project.progress = (project.total*100)/(project.sources*project.locales);
                    web.app.data.projects.push(project);
                    estimated += project.sources*project.locales;
                    actual += project.total;
                };
                web.app.data.progress = actual*100/estimated;
                $.getJSON("../_design/i18n/_view/projects", function(meta){
                    for (i in meta.rows){
                        name = meta.rows[i].key;
                        project = meta.rows[i].value;
                        if (!projects[name]){
                            projects[name] = project;
                        } else {
                            $.extend(projects[name], project);
                        }
                    };
                    web.app.data.projects_map = projects;
                    cb();
                });
            });
        },
        locales: function(options, cb){
            web.app.data.project = web.app.data.projects_map[options.project];
            var url = '../_design/i18n/_view/resources?group_level=3' +
                      '&startkey=["' + web.app.data.project._id + '"]' +
                      '&endkey=["' + web.app.data.project._id + '", {}]';
            $.getJSON(url, function(data){
                // data format:
                // { rows: [
                //      {
                //          key: ["project", "en_US", "domain"], // locale code
                //          value: 300                           // message count
                //      },
                //      ...
                // ]}
                var langs = [];
                var translationProgress = 0;
                // @TODO: Use count of unique [domain, key] pair.
                var sourceLocale = {
                    code: "",
                    messages: 0
                };
                var stats = {};
                var domain, message_count, localeCode;
                for (var i=0; i<data.rows.length; i++){
                    localeCode = data.rows[i].key[1];
                    domain = data.rows[i].key[2];
                    message_count = data.rows[i].value;
                    if (!stats[localeCode]) {
                        stats[localeCode] = {
                            message_count: 0,
                            domains: {}
                        };
                    }
                    stats[localeCode].message_count += message_count;
                    stats[localeCode].domains[domain] = message_count;
                    if (stats[localeCode].message_count > sourceLocale.messages) {
                        sourceLocale.code = localeCode;
                        sourceLocale.messages = stats[localeCode].message_count;
                    }
                    translationProgress += message_count;
                }

                sourceLocale.code = web.app.data.project.language;
                sourceLocale.messages = stats[web.app.data.project.language].message_count;

                for (var code in stats){
                    var progress = stats[code] ?
                        stats[code].message_count*100/sourceLocale.messages : 0;
                    langs.push({
                        code: code,
                        locale: Locale(code),
                        progress: progress
                    });
                    if (!stats[code]){
                        stats[code] = {};
                    }
                    stats[code].progress = progress;
                }
                web.app.data.stats = stats;
                web.app.data.langs = langs;
                web.app.data.progress = (translationProgress*100) /
                                        (sourceLocale.messages*langs.length);
                web.app.data.fromLocale = Locale(sourceLocale.code);
                web.app.data.localeCode.from = sourceLocale.code;
                cb();
            });
        },
        domains: function(options, cb){
            var domains = [];
            web.app.data.localeCode.to = options.locale;
            web.app.data.toLocale = Locale(options.locale);
            web.app.data.progress = web.app.data.stats[options.locale].progress;
            var from = web.app.data.stats[web.app.data.localeCode.from];
            var to = web.app.data.stats[options.locale];
            for (var domain in to.domains){
                domains.push({
                    title: domain,
                    progress: to.domains[domain]*100/from.domains[domain]
                });
            }
            web.app.data.domains = domains;
            cb();
        },
        translations: function(options, cb){
            var source_msgs = web.app.data.stats[options.from].domains[options.domain];
            var translated_msg = web.app.data.stats[options.to].domains[options.domain];
            web.app.data.progress = translated_msg*100/source_msgs;
            var keys;
            web.app.data.translation = {
                domain: options.domain,
                untranslated: source_msgs - translated_msg,
                unapproved: 0,
                obsolete: 0
            };
            web.app.data.translate = function(){
                // this == doc with i18n
                if (web.app.data.translation.to[this._id]){
                    return web.app.data.translation.to[this._id].message;
                } else {
                    return this.message;
                }
            };
            web.app.data.translateId = function(){
                if (web.app.data.translation.to[this._id]){
                    return web.app.data.translation.to[this._id]._id;
                } else {
                    return "";
                }
            };
            var queries = 2;
            var complete = function(){
                if (queries === 0){
                    cb();
                }
            };
            keys = [];
            keys.push([options.project, options.from, options.domain]);
            //keys.push([options.domain, options.to]);
            $.ajax({
                type: "post",
                url: "../_design/i18n/_view/resources?&reduce=false",
                contentType: "application/json",
                data: JSON.stringify({keys: keys}),
                complete: function(jqXHR, textStatus){
                    var data = $.parseJSON(jqXHR.responseText);
                    web.app.data.translation.from = data.rows;
                    queries--;
                    complete();
                }
            });

            keys = [];
            keys.push([options.project, options.to, options.domain]);
            //keys.push([options.domain, options.to]);
            $.ajax({
                type: "post",
                url: "../_design/i18n/_view/resources?&reduce=false",
                contentType: "application/json",
                data: JSON.stringify({keys: keys}),
                complete: function(jqXHR, textStatus){
                    var data = $.parseJSON(jqXHR.responseText);
                    // make translation map
                    var translated = {};
                    var i18n;
                    for (var i =0; i<data.rows.length; i++){
                        i18n = data.rows[i].value;
                        if (i18n.source){
                            translated[i18n.source.id] = data.rows[i].value;
                        }
                    }
                    web.app.data.translation.to = translated;
                    queries--;
                    complete();
                }
            });
        },
        translate: function(text, opts){
            var sourceId = opts.sourceId;
            var doc;
            if (web.app.data.translation.to[sourceId]){
                doc = web.app.data.translation.to[sourceId];
                doc.message = text;
                doc.source.rev = opts.sourceRev;
            } else {
                doc = {
                    "type": "i18n.resource",
                    "project": web.app.data.project._id,
                    "locale": web.app.data.localeCode.to,
                    "domain": web.app.data.translation.domain,
                    "message": text,
                    "name": opts.key,
                    "source": {
                        id: opts.sourceId,
                        rev: opts.sourceRev
                    }
                };
            }
            $.ajax({
                type: "post",
                url: "../",
                contentType: "application/json",
                data: JSON.stringify(doc),
                complete: function(jqXHR, textStatus){
                    var data = $.parseJSON(jqXHR.responseText);
                    if (data.error){
                        alert("Fail");
                    } else {
                        doc._id = data.id;
                        doc._rev = data.rev;
                        web.app.data.translation.to[sourceId] = doc;
                    }
                }
            });
        },
        translatePlural: function(text, opts){
            var sourceId = opts.sourceId;
            var doc;
            if (web.app.data.translation.to[sourceId]){
                //update
                doc = web.app.data.translation.to[sourceId];
                doc.source.rev = opts.sourceRev;
                doc.plurals[opts.quantity] = text;
            } else {
                doc = {
                    "type": "i18n.resource",
                    "project": web.app.data.project._id,
                    "locale": web.app.data.localeCode.to,
                    "domain": web.app.data.translation.domain,
                    "name": opts.key,
                    "plurals": {},
                    "source": {
                        id: opts.sourceId,
                        rev: opts.sourceRev
                    }
                };
                doc.plurals[opts.quantity] = text;
            }
            $.ajax({
                type: "post",
                url: "../",
                contentType: "application/json",
                data: JSON.stringify(doc),
                complete: function(jqXHR, textStatus){
                    var data = $.parseJSON(jqXHR.responseText);
                    if (data.error){
                        alert("Fail");
                    } else {
                        doc._id = data.id;
                        doc._rev = data.rev;
                        web.app.data.translation.to[sourceId] = doc;
                    }
                }
            });
        }
    }
});
