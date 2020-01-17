import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';

import echarts from './libs/echarts.min.js';
import './css/style.css!';
import './libs/china.js';
import './libs/world.js';
import './libs/dark.js';

export class Controller extends MetricsPanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);

       // 定义默认配置项
        const optionDefaults = {
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
		
		this.maps = ['中国', '世界'];
        _.defaults(this.panel, optionDefaults);

        
		//绑定grafana事件
        this.events.on('data-received', this.onDataReceived.bind(this));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('panel-initialized', this.render.bind(this));

        this.updateData()
    }


    // GET请求
    updateData() {
        const that = this;
        let xmlhttp;

        if (this.panel.USE_URL && this.panel.USE_FAKE_DATA && this.panel.fakeData) {
            //判断使用假数据条件
            this.data = eval(this.panel.fakeData);
        } else if (that.panel.USE_URL && !that.panel.USE_FAKE_DATA && that.panel.url && that.panel.request) {
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
            function formatData(resData) {
                let res = [];
                let resultData = resData.data.result;
                for (var i = 0; i < resultData.length; i++) {
                        res.push({
                            name: resultData[i].metric.location,
                            value: resultData[i].value[1]
                        });
                }
                return res;
            }

            //处理返回的数据并渲染到页面
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    that.UrlData = JSON.parse(xmlhttp.responseText);
                    this.data = formatData(that.UrlData);
                    that.onDataReceived();
                }
            }

        } else {
            xmlhttp = null;
        }
        this.$timeout(() => { this.updateData(); }, that.panel.updateInterval);
    }
	

	//根据data数据渲染页面函数
    onDataReceived(dataList) {
        if (!this.panel.USE_URL && !this.panel.USE_FAKE_DATA) {
            function formatDataFromPrometheus(data){
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    res.push({
                        name: data[i].target.match(/(location=")([^\"])*/g)[0].replace('location="',''),
                        value: data[i].datapoints[data[i].datapoints.length - 1][0]
                    });
                }
                return res;
            }
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

    onDataError() {
        this.render(this.data);
    }


    onInitEditMode() {
        this.addEditorTab('Data', 'public/plugins/echartsmap-panel/partials/module-editor.html', 2);
        this.addEditorTab('EcahrtsConfig', 'public/plugins/echartsmap-panel/partials/echarts-editor.html', 3);
    }


    importMap() {
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

    getPanelPath() {
        return `../${grafanaBootData.settings.panels[this.pluginId].baseUrl}/`;
    }


    link(scope, elem, attrs, ctrl) {
        const $panelContainer = elem.find('.echarts_container')[0];
        let option = {};
        let echartsData = [];

        ctrl.IS_DATA_CHANGED = true;
        const myChart = echarts.init($panelContainer, 'dark');

        ctrl.importMap();
        setTimeout(() => {
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

        this.events.on('render', (data) => {
            render(data);
            ctrl.renderingCompleted();
        });
    }
}

Controller.templateUrl = 'partials/module.html';
