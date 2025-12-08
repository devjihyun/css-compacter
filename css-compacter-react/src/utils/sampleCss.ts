export const sampleCss = `
/* --- group selector --- */
h1,
h2 , 
.title {
    color : #333 ;
    margin-bottom: 12px ;;
}

/* --- descendant selector --- */
#main-area   .content-box   {
    padding: 20px 30px ;
    background: #f9f9f9  ; ;
}

/* --- attribute selector (exact match) --- */
input[type="text"]   {
    border :1px solid #ccc ;
    padding :8px 12px  ;  ;
}

/* --- attribute selector (starts-with) --- */
a[href^="https://"] {
    color : blue ;
    text-decoration : underline ;;
}

/* --- pseudo-class + pseudo-element --- */
.button:hover::after {
    content : " →" ;
    margin-left :4px  ; 
    opacity:0.8;;
}

/* --- child selector --- */
.list > li {
    padding:5px 0 ;
    border-bottom :1px solid #eee ;;
}

/* --- adjacent sibling selector --- */
.list-item + .list-item {
    margin-top :10px ;
}

/* --- attribute selector + ID + class (이어붙이는 형태) --- */
.card[data-active="true"]#featured.special-type {
    background : #eaf4ff ;
    border :2px solid #7ab3e6  ; ;
    padding :16px 20px ;
}

/* --- attribute selector + class 여러개 이어붙임 --- */
.card[data-active="true"].is-open.is-highlighted {
    background:#fff7e8 ;
    color:#444  ;  ;
    box-shadow :0 2px 6px rgba(0,0,0,.15) ;
}

/* --- ID 먼저 등장 후 attribute 붙여쓰기 --- */
#promoCard.card[data-active="true"] {
    border-color:#ff8844 ;
    transform: translateY(-2px)  ; ;
}

/* --- attribute selector 뒤에 공백 후 ID 선택자 (후손 선택자) --- */
.card[data-active="true"]   #featured {
    background : #eef7ff ;
    padding :12px 18px ;; 
}

/* --- attribute selector 뒤에 공백 후 class 선택자 --- */
.card[data-active="true"]   .special-type {
    color : #446688 ;
    font-weight : bold ; ;
}

/* --- more deep descendant chain --- */
.card[data-active="true"]   .info-box   .title {
    font-size:20px ;
    margin-bottom :6px ;;
}

/* --- attribute + 공백 + ID + pseudo-class --- */
.card[data-active="true"]   #badge:hover {
    background:#ffddaa ;
    border-color:#ff9900 ; ;
}

/* --- attribute + 공백 + 클래스 + pseudo-element --- */
.card[data-active="true"]   .tag::before {
    content:"#";
    color:#999 ; ;
}

/* --- universal selector --- */
*  {
    box-sizing: border-box ;  ; 
}

}`;
