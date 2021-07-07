$(document).ready(function(){

    var ent = '';
    var ans ='';
    var now = '';
    var log_txt = '';
    var decimal = true;
    var reset =''


function round(val){
    val = val.toString().split('');
    if(val.indexOf('.')!== -1){
        var valtxt = val.slice(val.indexOf('.') + 1, val.length);
        val = val.slice(0, val.indexOf('.') + 1);

        var i = 0;
        while (valtxt[i] < 1){
            i++
        }
        valtxt = valtxt.join('').slice(0,i+2);
        if (valtxt[valtxt.length]==='0') {
            valtxt = valtxt.slice(0, -1);
        }
        return val.join('') + valtxt;
    
    }else{
        return val.join('');

    }
}

 $('button').click(function(){
     ent = $(this).att('value');
     console.log('entry:' + ent);

     if(reset) {
         if(ent ==='/' || ent === '*' || ent === '-' || ent === '+'){
             log = 'ans';
         } else {
             ans =''
         }
     }
     reset = false;

     if (ent === 'ac'|| ent ==='ce'  && now === 'noChange'){
         ans= '';
         now ='';
         ent = '';
         log = '';
         $('#history').html('0');
         $('#ans1').html('0');
         decimal = true;
     } else if (ent === 'ce'){
         $('#history').html(log.slice(0,-now.length));
         log = log.slice(0, -now.length);
         ans = ans.slice(0, -now.length);
         now= ans;
         if (log.length === 0 || log === '' ){
             $('#history').html('0');
         }
         $('#ans1').html('0');
         ent = '';
         decimal = true;
     }
 })

});