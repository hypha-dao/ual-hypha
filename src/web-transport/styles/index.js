export default `
/* UAL Hypha */

.%prefix% {
  display: none;
  position: fixed;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 9999999999999;
  font-size: 13px ;
  background: rgba(0, 0, 0, 0.65) ;
  width: 100%;
  height: 100%;
}

.%prefix%-active {
  display: flex!important
}

:root {
  --dark-blu: #131C32;
  --blu: #1D2946;
  --blu-hover: #243150;
  --grey: #788298;
  --white: #FFFFFF;
}
 
.%prefix%-wrapper {
  display: none;
  width:280px;
  min-height: 280px;
  background-color:var(--dark-blu);
  border-radius:20px;
  box-shadow:0px 0px 20px rgba(0,0,0,0.2);
  text-align:center;
  font-family: 'Lato', sans-serif;
}

.%prefix%-active .%prefix%-wrapper {
  display: block!important;  
}

.%prefix%-top-banner {
  position:relative;
  background:var(--blu);
  display:flex;
  align-items: center;
  justify-content: flex-end;
  height:40px;
  border-radius:20px 20px 0px 0px;
}

.%prefix%-top-banner .%prefix%-close {
  width:30px;
  height:30px;
  display:flex;
  align-items: center;
  justify-content: center;
  margin-right:8px;
  cursor:pointer;
  position:relative;
  z-index:10;
}

.%prefix%-top-banner .%prefix%-close svg {
  width:12px;
  height:12px;
}

.%prefix%-logo {
  width:100%;
  height:60px;
  transform:translateY(-20px);
  margin-bottom:-20px;
  display:block;
}

.%prefix%-logo svg {
  width:60px;
  height:60px;
}

.%prefix%-content {
  padding:0px 20px 20px 20px;
}

.%prefix%-title {
  color:var(--white);
  font-size:20px;
  margin:10px 0px 0px 0px;
}

.%prefix%-text {
  color:var(--grey);
  font-size:13px;
  line-height:1.3em;
}

.%prefix%-qr-area {
  width:238px;
  height:238px;
  box-sizing: border-box;
  border:2px solid var(--blu);
  border-radius:8px;
  padding:1px;
  margin-top:8px;
  display: inline-block;
}

.%prefix%-qr-here {
  width:100%;
  height:100%;
  background:var(--blu);
}

.%prefix%-content button {
  color:var(--white);
  font-weight:600;
  font-size:13px;
  width:100%;
  height:50px;
  border:none;
  border-radius: 15px;
  background:var(--blu);
  display: none;
  margin-top:18px;
  cursor:pointer;
  transition-duration:.2s;
}

.%prefix%-content button:hover {
  background-color:var(--blu-hover);
}

@media screen and (max-width:500px) { 
  .%prefix%-content button { display: inline-block!important; }
  .%prefix%-qr-area { display: none!important; }
}
`;
