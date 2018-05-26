var vm = new Vue({
        el: '#app',
        data: {
        	modalInfo:{ // 所有弹出框的控制变量
        		m_login:false,	// 登陆
        		m_register:false,// 注册
        		prize_records:false,// 夺宝记录
        		welfare_records:false,// 福利记录
        		m_invite:false,// 邀请
        		m_payment:false,// 购买
        		m_qishu:false,// 期数详情
        	},
        	
        	errorTips:{  // 所有校验提示语展示 true-展示 false-隐藏
        		reg_password:false,// 注册时的钱包密码
        	},
        	treasure1:{
        		name:null,
        		currentCycle:null,
        		currentShare:null,
        		totalShare:null,
        	},
        	treasure2:{
        		name:null,
        		currentCycle:null,
        		currentShare:null,
        		totalShare:null,
        	},
        	treasure3:{
        		name:null,
        		currentCycle:null,
        		currentShare:null,
        		totalShare:null,
        	},
        	treasure4:{
        		name:null,
        		currentCycle:null,
        		currentShare:null,
        		totalShare:null,
        	},
        	WTLog:{
        		currentCycle:null,
        		winCode:"未开奖",
        		name:null,
        		bids:null,
        		cycle:null,
        		currentShare:null,
        		currentPage:1,
        		logSize:null
        	},
        	SDTAddress:"n1h2KMrKbeQdTV39rNH7i6nee4Ba6j3MxCk",
        	account:null,
            faq_val:1,
            pay:{
            	copies:1,
            	currentShare:null,
            	totalShare:null,
            	name:null
            },
            aaa:80,
            walletFile:{
            	name:null,
            	key:null,
            	pass:null,
            	msg:null,
            	regpass:null,
            	regstep:true,
            	regkey:null,
            	regname:null
            },
            
            user:{
            	NAS:0,
            	SDT:0,
            	compute:0
            },
            userWT:{
            	winNas:null,
            	logs:null,
            	currentPage:1,
            	logSize:null
            },
            WelfareLog:{
            	winNas:null,
            	winSdt:null,
            	currentPage:1,
            	logSize:null
            },
            totalFee:0,
            saleAddress:null,
            intervalId:null,
        },
        methods: {
        	clearwallt(){
        		this.walletFile.name=null;
        		this.walletFile.key=null;
        		this.walletFile.pass=null;
        		this.walletFile.msg=null;
        		this.walletFile.regpass=null;
        		this.walletFile.regstep=true;
        		this.walletFile.regkey=null;
        		this.walletFile.regname=null;
        	},
        	downregkey(){
        		this.export_raw(this.walletFile.regname,this.walletFile.regkey);
        		this.$Message.success({ content: "钱包生成成功!!!",duration: 3});
        		this.clearwallt();
        		this.modalInfo.m_login=true;
        		this.modalInfo.m_register=false;
        	},
        	regWallet(){
        		if(!this.walletFile.regpass||this.walletFile.regpass.length<6){
        			vm.$Message.error({ content: "钱包密码不能少于6位!!!",duration: 3});
     	  		   return
        		}
        		var acc = Account.NewAccount();
        		this.walletFile.regname=acc.getAddressString();
        		this.walletFile.regkey = acc.toKeyString(this.walletFile.regpass);
        		this.walletFile.regstep=false;
        	},
        	 export_raw(name, data) {  
        	    var urlObject = window.URL || window.webkitURL || window;  
        	  
        	    var export_blob = new Blob([data]);  
        	  
        	    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")  
        	    save_link.href = urlObject.createObjectURL(export_blob);  
        	    save_link.download = name;  
        	    var ev = document.createEvent("MouseEvents");  
        	    ev.initMouseEvent(  
        	        "click", true, false, window, 0, 0, 0, 0, 0  
        	        , false, false, false, false, 0, null  
        	        );  
        	    save_link.dispatchEvent(ev);  
        	}  
        	,
        	readNas( funNume ,args,call){
        	  	  var from=this.account?this.account.getAddressString():this.SDTAddress;
        	  	  neb.api.call({
        	  	     chainID: 1,
        	  	     from: from,
        	  	     to: this.SDTAddress,
        	  	     value: 0,
        	  	     nonce:  1,
        	  	     gasPrice: 1000000,
        	  	     gasLimit: 200000,
        	  	     contract: {
        	  	         function: funNume,
        	  	         args: args
        	  	     }
        	  	  }).then(call);
        	  },
        	   sendNas(funNume ,args,value,call){
        	  	   if(!this.account.privKey){
        	  		 vm.$Message.error({ content: "请先登录!!!",duration: 3});
        	  		   return
        	  	   }
        	  	   neb.api.getAccountState(this.account.getAddressString()).then(function (state) {
        	  		   var tx = new Transaction({
        	  			   chainID: 1,
        	  			   from: vm.account,
        	  			   to: vm.SDTAddress,
        	  			   value: value*1000000000000000000,
        	  			   nonce:parseInt(state.nonce) + 1,
        	  			   gasPrice: 1000000,
        	  			   gasLimit: 200000,
        	  			     contract: {
        	  			         function: funNume,
        	  			         args: args
        	  			     }
        	  			});
        	  		   tx.signTransaction();
        	  		   neb.api.sendRawTransaction(tx.toProtoString()).then(call).catch(function (err) {
        	  			 vm.$Message.error({ content: err.message,duration: 3});
        	           });
        	  	   });
        	  	},
            showRecords(){
        	  		if(!this.account){
                		 this.$Message.error({ content: '请先登录！',duration: 3});
                		return ;
                	}
    	  		this.readNas("welfareLogs",'["'+this.account.getAddressString()+'"]',function(data){
            		var result=JSON.parse(data.result);
            		vm.WelfareLog.winNas=result.winNas;
            		vm.WelfareLog.winSdt=result.winSdt;
            		vm.WelfareLog.logs=result.logs;
            		vm.WelfareLog.logSize=vm.getObjectCount(vm.WelfareLog.logs);
            	});
    	  		 this.modalInfo.welfare_records = true;
            },
            join_game(type){
            	var obj;
            	 if(type==1){
    				 obj=vm.treasure1;
    			 }else if(type==2){
    				 obj=vm.treasure2;
    			 }else if(type==3){
    				 obj=vm.treasure3;
    			 }else if(type==4){
    				 obj=vm.treasure4;
    			 }
            	 this.pay.name=obj.name;
            	 this.pay.totalShare=obj.totalShare;
            	 this.pay.currentShare=obj.currentShare;
             	 this.modalInfo.m_payment = true;
            },
            inputBlur(e){
            	e.target.blur();
            },
            selectWallet (file) {
                this.walletFile.name = file.name;
                var reader = new FileReader();// 新建一个FileReader
    	    	reader.readAsText(file, "UTF-8");// 读取文件
    	    	reader.onload = function(evt){ // 读取完文件之后会回来这里
    	    		vm.walletFile.key = evt.target.result; // 读取文件内容
    	    	}
                return false;
            },
            loadTreasure(){
            	this.readNas("getWTs",'[["10NAS","20NAS","30NAS","50NAS"]]',function(data){
            		 var result=JSON.parse(data.result);
            		 for(key in result){ 
            			 var obj;
            			 if(key==="10NAS"){
            				 obj=vm.treasure1;
            			 }else if(key==="20NAS"){
            				 obj=vm.treasure2;
            			 }else if(key==="30NAS"){
            				 obj=vm.treasure3;
            			 }else if(key==="50NAS"){
            				 obj=vm.treasure4;
            			 }
            			 var value =result[key];
            			 obj.name=key;
            			 obj.currentCycle=value.currentCycle;
            			 obj.currentShare=value.currentShare;
            			 obj.totalShare=value.totalShare;
        			 }
            	 });
            },
            unlock(){
            	if(!this.walletFile.key){
            		this.walletFile.msg="请选择钱包文件或输入钱包JSON";
            		return;
            	}
            	try{
            		var acc=new Account().fromKey(this.walletFile.key, this.walletFile.value);
            		this.account=acc;
            	}catch (e) {
            		console.log(e);
            		this.walletFile.msg="文件或密码错误！！";
            		return;
            	}
        		
        		this.modalInfo.m_login=false;
        		this.walletFile.msg=null;
        		this.getUserInfo();
        		localStorage.setItem("json", this.walletFile.key);
        		localStorage.setItem("pass", this.walletFile.value);
        		this.$Message.success({ content: '钱包登录成功！',duration: 3});
            },
            getUserInfo(){
            	this.walletFile.name=this.account.getAddressString();
            	this.flushNAS();
            	this.flushSDT();
            },
            flushNAS(){
            	neb.api.getAccountState(this.account.getAddressString()).then(function (state) {
                    state = state.result || state;
                    vm.user.NAS=state.balance/1000000000000000000;
                }).catch(function (err) {
                    console.log(err);
                })
            },
            flushSDT(){
            	this.readNas("getInfo",'["'+this.account.getAddressString()+'"]',function(data){
            		 var result=JSON.parse(data.result);
            		 vm.user.SDT=result.sdt;
            		 vm.user.compute=result.compute;
            	});
            },
            flushTotalFee(){
            	this.readNas("totalFee",'[]',function(data){
            		var result=JSON.parse(data.result);
            		vm.totalFee=result;
            	});
            },
            getWTLog(name,cycle){
            	
            	this.WTLog.bids=null;
            	this.WTLog.winCode="未开奖";
            	this.WTLog.currentShare=null;
            	this.WTLog.name=name;
            	this.WTLog.currentCycle=cycle;
            	this.WTLog.cycle=cycle;
            	
	   			this.readNas("getWT",'["'+name+'",'+cycle+']',function(data){
            		var result=JSON.parse(data.result);
            		if(result.winCode){
            			vm.WTLog.winCode=result.winCode;
            		}
            		vm.WTLog.currentCycle=result.currentCycle;
            		vm.WTLog.currentShare=result.currentShare;
            		vm.WTLog.bids=result.bids;
            		vm.WTLog.logSize=vm.getObjectCount(vm.WTLog.bids);
            	});
	   			this.modalInfo.m_qishu=true;
            },
            payWT(){
            	if(this.intervalId){
            		this.$Message.error({ content: '已有一笔交易正在确认中，请稍后再试！',duration: 3});
            		return ;
            	}
            	if(!this.account){
            		this.$Message.error({ content: '请先登录！',duration: 3});
            		return ;
            	}
            	if(this.pay.copies/10>=this.user.NAS){
            		 this.$Message.error({ content: 'NAS余额不足，请充值或稍后再试！',duration: 3});
            		 return;
            	}
            	var saleString=saleAddress?',"'+saleAddress+'"':"";
            	console.log(saleString);
        	    this.sendNas("attendWT" ,'["'+this.pay.name+'"'+saleString+']',this.pay.copies/10,function(data){
            		vm.$Message.info({ content: '提交成功，请等待区块链确认！',duration: 3});
            		var hash=data.txhash;
            		vm.intervalId=setInterval( function (hash){
                    	neb.api.getTransactionReceipt(hash).then( function (result) {
    				 		if(result.status==1){
    				 			vm.$Message.success({ content: '恭喜您，参与夺宝成功！！！',duration: 3});
    				 			window.clearInterval(vm.intervalId);
    				 			vm.intervalId=null;
    				 			vm.loadTreasure();
    				 			vm.flushTotalFee();
    				 			vm.getUserInfo();
    				 		}else if(result.status==0){
    				 			vm.$Message.error({ content: '参与夺宝失败，请稍后再试！！！',duration: 3});
    				 			window.clearInterval(vm.intervalId);
    				 			vm.intervalId=null;
    				 		}else if(result.status==2){
    				 		}else{
    				 			window.clearInterval(vm.intervalId);
    				 			vm.intervalId=null;
    				 		}
        	            });
                    },7000,hash);
            	 });
        	     this.pay.copies=1;
            	 this.modalInfo.m_payment=false;
            } ,
            verifyLogin(){
            	if(this.walletFile.key&&this.walletFile.value){
            		try{
                		var acc=new Account().fromKey(this.walletFile.key, this.walletFile.value);
                		this.account=acc;
                	}catch (e) {
                		console.log(e);
                		return;
                	}
            		this.getUserInfo();
            	}
            },
            exit(){
            	this.account=null;
            	localStorage.removeItem("json");
            	localStorage.removeItem("pass");
            },
            getObjectCount(obj){
            	  var n = 0;  
                  for (var i in obj) {  
                      n++;  
                  }  
                  return n;  
            },
            getUserWTLog(){
            	if(!this.account){
            		this.$Message.error({ content: '请先登录！',duration: 3});
            		return ;
            	}
            	this.readNas("partakeLogs",'["'+this.walletFile.name+'"]',function(data){
            		var result=JSON.parse(data.result);
            		vm.userWT.winNas=result.winNas;
            		vm.userWT.logs=result.logs;
            		vm.userWT.logSize=vm.getObjectCount(vm.userWT.logs);
            	});
            	vm.modalInfo.prize_records=true;// 夺宝记录
            },
            userWTPage(currentPage){
            	this.userWT.currentPage=currentPage;
            },
            WTLogPage(currentPage){
            	this.WTLog.currentPage=currentPage;
            },
            WelfareLogPage(currentPage){
            	this.WelfareLog.currentPage=currentPage;
            },
            saleprizes(){
            	if(!this.account){
            		this.$Message.error({ content: '请先登录！',duration: 3});
            		return ;
            	}
            	this.modalInfo.m_invite=true;
            },
             getQueryString(name) {
          	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
          	    var r = window.location.search.substr(1).match(reg);
          	    if (r != null) return unescape(r[2]); return null;
          	},
            verifysale(){
          		saleAddress=this.getQueryString("v");
            },
            copyHttp(){
            	var saleHttp=document.getElementById("saleHttp");
            	saleHttp.style.display="block";
            	saleHttp.select(); // 选择对象
            	document.execCommand("Copy"); // 执行浏览器复制命令
            	this.modalInfo.m_invite=false;
            	this.$Message.success({ content: '复制成功，快去发送给好友吧！',duration: 3});
            }
        }, 
        created: function () {
        	this.loadTreasure();
        	this.flushTotalFee();
        	document.getElementById("app").style.display="block";
        	this.walletFile.key=localStorage.getItem("json");
        	this.walletFile.value=localStorage.getItem("pass");
        	this.verifyLogin();
        	this.verifysale();
        	setInterval( function (){
        		vm.loadTreasure();
        		vm.flushTotalFee();
        	},8000);
        }
    })