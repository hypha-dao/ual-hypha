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
  display: flex;
}

.%prefix%-inner {
  background: #EFF1F7 ;
  margin: 20px ;
  padding-top: 50px ;
  border-radius: 20px ;
  box-shadow: 0px 4px 100px rgb(0 0 0 / 50%) ;
  width: 340px ;
  position: relative ;
}

.%prefix%-request {
  background-color: white;
  text-align: center;
  padding: 20px ;
  border-radius: 20px ;
  border-top-left-radius: 0 ;
  border-top-right-radius: 0 ;
  display: flex;
  flex-direction: column;
}

.%prefix%-close {
  display: block ;
  position: absolute ;
  top: 11px ;
  right: 16px ;
  width: 28px ;
  height: 28px ;
  background-size: 14px ;
  background-repeat: no-repeat ;
  background-position: 50% 7px ;
  border-radius: 100% ;
  cursor: pointer ;
}

.%prefix%-logo {
  width: 70px ;
  height: 70px ;
  margin: 0 auto ;
  margin-top: -56px ;
}

.%prefix%-button {
  color: rgb(43,74, 42 );
  background: #EFF1F7 ;
  border: 1px solid #EFF1F7 ;
  text-decoration: none ;
  font-size: 17px ;
  flex-grow: 1 ;
  flex: 1 ;
  width: 100% ;
  line-height: 1 ;
  padding: 20px 18px ;
  border-radius: 12px ;
  font-weight: 400 ;
  text-align: center ;
  display: block ;
  margin-top: 21px ;
  cursor: pointer ;
  box-sizing: border-box;
}`;
