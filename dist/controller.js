'use strict';

System.register(['app/plugins/sdk', 'lodash', 'app/core/utils/kbn', './libs/echarts.min.js', './css/style.css!', './libs/china.js', './libs/world.js', './libs/dark.js'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, _, kbn, echarts, _createClass, Controller;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_appPluginsSdk) {
            MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
        }, function (_lodash) {
            _ = _lodash.default;
        }, function (_appCoreUtilsKbn) {
            kbn = _appCoreUtilsKbn.default;
        }, function (_libsEchartsMinJs) {
            echarts = _libsEchartsMinJs.default;
        }, function (_cssStyleCss) {}, function (_libsChinaJs) {}, function (_libsWorldJs) {}, function (_libsDarkJs) {}],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('Controller', Controller = function (_MetricsPanelCtrl) {
                _inherits(Controller, _MetricsPanelCtrl);

                function Controller($scope, $injector) {
                    _classCallCheck(this, Controller);

                    var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this, $scope, $injector));

                    // 定义默认配置项
                    var optionDefaults = {
                        EchartsOption: 'console.log(JSON.stringify(echartsData));\n\noption = {};',
                        IS_MAP: false,
                        map: 'china',
                        USE_URL: false,
                        USE_FAKE_DATA: false,
                        fakeData: '',
                        url: '',
                        request: '',
                        updateInterval: 60000
                    };

                    _this.maps = ['中国', '世界'];
                    _.defaults(_this.panel, optionDefaults);

                    //绑定grafana事件
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('panel-initialized', _this.render.bind(_this));

                    _this.updateData();
                    return _this;
                }

                // GET请求


                _createClass(Controller, [{
                    key: 'updateData',
                    value: function updateData() {
                        var _this2 = this;

                        var that = this;
                        var xmlhttp = void 0;

                        if (this.panel.USE_URL && this.panel.USE_FAKE_DATA && this.panel.fakeData) {
                            //判断使用假数据条件
                            this.data = eval(this.panel.fakeData);
                        } else if (that.panel.USE_URL && !that.panel.USE_FAKE_DATA && that.panel.url && that.panel.request) {
                            var formatData = function formatData(resData) {
                                var res = [];
                                var resultData = resData.data.result;
                                for (var i = 0; i < resultData.length; i++) {
                                    res.push({
                                        name: resultData[i].metric.location,
                                        value: resultData[i].value[1]
                                    });
                                }
                                return res;
                            };

                            //判断使用api接口条件,如果满足创建xmlhttp
                            if (window.XMLHttpRequest) {
                                xmlhttp = new XMLHttpRequest();
                            } else {
                                xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
                            }

                            xmlhttp.open(that.panel.request, that.panel.url, true);
                            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
                            xmlhttp.send(null);

                            //格式化http请求返回的数据


                            //处理返回的数据并渲染到页面
                            xmlhttp.onreadystatechange = function () {
                                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                                    that.UrlData = JSON.parse(xmlhttp.responseText);
                                    _this2.data = formatData(that.UrlData);
                                    that.onDataReceived();
                                }
                            };
                        } else {
                            xmlhttp = null;
                        }
                        this.$timeout(function () {
                            _this2.updateData();
                        }, that.panel.updateInterval);
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        if (!this.panel.USE_URL && !this.panel.USE_FAKE_DATA) {
                            var formatDataFromPrometheus = function formatDataFromPrometheus(data) {
                                var res = [];
                                for (var i = 0; i < data.length; i++) {
                                    res.push({
                                        name: data[i].target.match(/(location=")([^\"])*/g)[0].replace('location="', ''),
                                        value: data[i].datapoints[data[i].datapoints.length - 1][0]
                                    });
                                }
                                return res;
                            };

                            this.data = formatDataFromPrometheus(dataList);
                            this.IS_DATA_CHANGED = true;
                            this.render(this.data);
                            this.IS_DATA_CHANGED = false;
                        } else {
                            this.data = !this.panel.USE_URL && !this.panel.USE_FAKE_DATA ? dataList : this.data;
                            this.IS_DATA_CHANGED = true;
                            this.render(this.data);
                            this.IS_DATA_CHANGED = false;
                        }
                    }
                }, {
                    key: 'onDataError',
                    value: function onDataError() {
                        this.render(this.data);
                    }
                }, {
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('Data', 'public/plugins/echartsmap-panel/partials/module-editor.html', 2);
                        this.addEditorTab('EcahrtsConfig', 'public/plugins/echartsmap-panel/partials/echarts-editor.html', 3);
                    }
                }, {
                    key: 'importMap',
                    value: function importMap() {
                        if (!this.panel.IS_MAP) return;
                        switch (this.panel.map) {
                            case '中国':
                                System.import(this.getPanelPath() + 'libs/china.js');
                                break;
                            case '世界':
                                System.import(this.getPanelPath() + 'libs/world.js');
                                break;
                            default:
                                break;
                        }
                    }
                }, {
                    key: 'getPanelPath',
                    value: function getPanelPath() {
                        return '../' + grafanaBootData.settings.panels[this.pluginId].baseUrl + '/';
                    }
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl) {
                        var $panelContainer = elem.find('.echarts_container')[0];
                        var option = {};
                        var echartsData = [];

                        ctrl.IS_DATA_CHANGED = true;
                        var myChart = echarts.init($panelContainer, 'dark');

                        ctrl.importMap();
                        setTimeout(function () {
                            myChart.resize();
                        }, 60000);

                        function render(data) {
                            if (!myChart) {
                                return;
                            }

                            if (ctrl.IS_DATA_CHANGED) {
                                myChart.clear();
                                //echart加载option配置
                                echartsData = ctrl.data;
                                eval(ctrl.panel.EchartsOption);
                                var optionConfig = option;
                                myChart.setOption(optionConfig);
                            }
                            myChart.resize();
                        }

                        this.events.on('render', function (data) {
                            render(data);
                            ctrl.renderingCompleted();
                        });
                    }
                }]);

                return Controller;
            }(MetricsPanelCtrl));

            _export('Controller', Controller);

            Controller.templateUrl = 'partials/module.html';
        }
    };
});
//# sourceMappingURL=controller.js.map
