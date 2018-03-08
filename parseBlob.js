class parseBlob {
    constructor() {}

    readAs(type,blob,cb){
        let r = new FileReader();
        r.onloadend = function(){
            if(typeof(cb) === 'function') {
                cb.call(r,r.result);
            }
        };
        try{
            r['readAs'+type](blob);
        }catch(e){}
    }

    //接受到blob数据后的转码
    parseBlobData(blob){
        let shortVar, intVar, stringVar;
        /*//转成16位short
        this.readAs('ArrayBuffer',blob,function(arr){
            shortVar = (new Int16Array(arr))[0];
            return shortVar;
            this._print(shortVar);
        });

        //转成32位int
        this.readAs('ArrayBuffer',blob,function(arr){
            intVar = (new Int32Array(arr))[0];
            return intVar;
            this._print(intVar);
        });*/

        //转成字符串
        this.readAs('Text',blob,function(result){
            stringVar = result;
            return stringVar;
            this._print(stringVar);
        });
    }

    _print(name, msg) {
        console.log(name, msg);
    }
}

let parseBlob1 = new parseBlob();
module.exports = parseBlob1;