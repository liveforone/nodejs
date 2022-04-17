//==모듈을 만들어 내보내기==//
let m = {
    v1 : "v1",
    f : function() {
        console.log(this.v1);
    }
}

module.exports = m;