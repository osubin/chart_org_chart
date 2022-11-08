import data from '../employee.js';

const oc = {
    groupObj: [

    ], 
    groupSortObj: [

    ],
    nodeObj: [

    ], 
    jsonObj: {
        'name' : '',
        'title' : '', 
        'children' : [

        ]
    }, 
    maxDepLen: 0
    ,
    init: function(){
        oc.makeJsonObj();
        oc.loadOrgChart(oc.jsonObj, 4);

    }, 
    makeJsonObj: function(){
        Object.keys(data).forEach(element => {
            if(data[element].isGroup == "false"){
                oc.nodeObj.push(data[element]);
            }else{
                oc.groupObj.push(data[element]);
            }
        });

        // level 최대값 구하기
        var depLen = Object.values(data).map(function(v) {
            return v.level;
        });
        oc.maxDepLen = Math.max.apply(null, depLen);

        //level 별 객체 분리
        Object.keys(oc.groupObj).forEach(element => {
            for(var i=1; i <= oc.maxDepLen; i++){
                if(oc.groupObj[element].level == i){
                    if(oc.groupSortObj.hasOwnProperty(`level${i}GroupObj`)){
                        oc.groupSortObj[`level${i}GroupObj`].push(oc.groupObj[element]);
                    }else{
                        oc.groupSortObj[`level${i}GroupObj`] = [oc.groupObj[element]];
                    }
                }
            }
        });

        console.log(oc.groupSortObj);

        
        for(var i = 1; i <= oc.maxDepLen; i++){
            if(i == 1){
                oc.jsonObj.name = oc.groupSortObj['level1GroupObj'][0].name;
                oc.jsonObj.title = oc.groupSortObj['level1GroupObj'][0].name;
            }else if(i == 2){
                oc.jsonObj.children = oc.groupSortObj['level2GroupObj'];
            }else if(i == 3){
                oc.groupSortObj[`level3GroupObj`].forEach(element => {
                    const idx = oc.jsonObj.children.findIndex(v => v.key == element.from);

                    if(oc.jsonObj.children[idx].hasOwnProperty('children')){
                        oc.jsonObj.children[idx].children.push(element)
                    }else{
                        oc.jsonObj.children[idx].children = [element];
                    }
                    
                });
            }else{
                for(var i=0; i<oc.jsonObj.children.length; i++){
                        oc.groupSortObj['level4GroupObj'].forEach(element => {
                            const idx = oc.jsonObj.children[i].children.findIndex(v => v.key == element.from);
                            if(idx > -1){
                                if(oc.jsonObj.children[i].children[idx].hasOwnProperty('children')){
                                    oc.jsonObj.children[i].children[idx].children.push(element)
                                }else{
                                    oc.jsonObj.children[i].children[idx].children = [element];
                                }
                            }
                        })
                }
            }
        }
        console.log(oc.jsonObj)
    }, 
    loadOrgChart: function(dataSource, depth){
        $('#chartContainer').orgchart({
            'data' : dataSource, 
            'depth' : depth, 
            'nodeContent' : 'name'
        })
    }
}

window.addEventListener('DOMContentLoaded', function(){
    oc.init();
})
