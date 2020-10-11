export default ( url, callback )=>{
    var script = document.createElement('script'),
        fn = callback || function(){};
    script.type = 'text/javascript';
    if(script.readyState){//IE
        script.onreadystatechange = function(){
            if( script.readyState == 'loaded' || script.readyState == 'complete' ){
                script.onreadystatechange = null;
                fn();
            }
        };
    }else{//其他浏览器
        script.onload = function(){
            fn();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}