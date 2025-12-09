export const sampleCss = `
/* --- group selector --- */
h1 ,
h2  ,
.title   {
    margin-bottom : 28px  ;
    color : #222  ;;
}

/* --- descendant selector --- */
#main-area    .content-box   {
    padding : 20px 30px ;
    background: #fafafa  ; ;
}

/* --- child + sibling selector --- */
.list > li + li  {
    margin-top : 12px ;
}

/* --- attribute selector exact --- */
input[type="text"]   {
    border : 1px solid #ccc ;
    padding : 8px 12px ; ;
}

/* --- attribute contains & starts-with --- */
a[href^="https://"]{
    color : blue ;
    text-decoration : underline ; ;
}

img[alt*="thumbnail"] {
    width : 100px ;
    height : 60px  ;;
}

/* --- pseudo class + element --- */
.button:hover::after {
    content: " →" ;
    margin-left : 4px ;
    opacity : .8 ;;
}

/* --- attribute + ID + class 이어붙임(테스트 핵심) --- */
.card[data-active="true"]#featured.special-type{
    padding : 16px 20px ;
    background : #eaf4ff ;
    border : 2px solid #7ab3e6 ;;
}

/* --- attribute + class 이어붙임 --- */
.card[data-active="true"].is-open.is-highlighted {
    background:#fff7e8 ;
    color:#444 ;
    box-shadow: 0 2px 6px rgba(0,0,0,.2) ;;
}

/* --- ID + class + attribute 순서 변경 케이스 --- */
#promoBox.special[data-active="false"] {
    width : 200px ;
    height : 80px ;
    border : 1px dashed #aaa  ;;
}

/* --- attribute 뒤에 후손 ID/class 케이스 --- */
.card[data-active="true"]   #badge   {
    padding : 12px 18px ;
    background : #eef7ff ; ;
}

.card[data-active="true"]   .tag::before {
    content : "#" ;
    color : #999 ; ;
}

/* --- complex chain --- */
.section   .info-box   .title {
    font-size : 24px ;
    margin-bottom : 10px ;;
}

/* --- multiple values, url(), important --- */
.hero {
    background: url("/img/hero.png") no-repeat center center;
    background-size : cover ;
    padding : 40px 20px !important ;
    box-shadow : 0 4px 12px rgba(0,0,0,0.15) , 0 0 4px rgba(0,0,0,0.1) ;;
}

/* --- at-rule test --- */
@media screen and (min-width: 768px) {
    .grid-item{
        width : 50% ;
        padding : 16px ;
    }
}

/* --- universal selector --- */
* {
    box-sizing : border-box ;
}

}`;
