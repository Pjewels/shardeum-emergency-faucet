// METAMASK

//If Metamask is not detected the user will be told to install Metamask.
function detectMetamaskInstalled() {
  try {
    ethereum.isMetaMask;
  } catch (missingMetamask) {
    alert(
      "Metamask not detected in browser! Install Metamask browser extension, then refresh page!"
    );
  }
}

//Alert user to connect their Metamask address to the site before doing any transactions.
function checkAddressMissingMetamask() {
  if (accounts.length == 0) {
    alert(
      "No address from Metamask found. Click the top button to connect your Metamask account then try again without refreshing the page."
    );
  }
}

// Function called for getting Metamask accounts on Shardeum.
// Used in every button in case the user forgets to click the top button.
function enableMetamaskOnShardeum() {
  // Get account details from Metamask wallet.
  getAccount();
  // Check if user is on the LuksoL16 testnet. If not, alert them to change to Shardeum.
  if (window.ethereum.networkVersion != 8081) {
    alert(
      "You are not on the Shardeum Testnet! Please switch to Shardeum and refresh page."
    );
    console.log(window.ethereum.networkVersion);
  }
}

//Get the latest value.
function checkLastDateWithdrawn() {
  contractDefined_JS.methods
    .userPreviousWithdrawTime(accounts[0])
    .call((err, balance) => {
      if (balance === undefined) {
        document.getElementById("getValueStateSmartContract").innerHTML =
          "Install Metamask and select Shardeum Testnet to have a Web3 provider to read blockchain data.";
      } else {
        console.log(BigInt(Date.now()));
        console.log(BigInt((BigInt(balance) + 43200n) * 1000n));
        if (BigInt(Date.now()) > BigInt((BigInt(balance) + 43200n) * 1000n)) {
          document.getElementById("getValueStateSmartContract").innerHTML =
            "You can withdraw from the faucet now.";
        } else {
          balance = new Date(balance * 1000).toLocaleString();
          document.getElementById("getValueStateSmartContract").innerHTML =
            balance;
        }
      }
    });
}

// return the last time the person withdrew from our faucet
async function getAccount() {
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  document.getElementById("enableEthereumButton").innerText =
    accounts[0].substr(0, 5) + "..." + accounts[0].substr(38, 4);
  checkLastDateWithdrawn();
}

// ON LOAD

//Metamask sending trasactions:
//https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters

//Empty array to be filled once Metamask is called.
let accounts = [];
document.getElementById("enableEthereumButton").innerHTML;
document.getElementById("getValueStateSmartContract").innerHTML =
  "Please connect wallet first to check withdrawal time.";

//When the page is opened check for error handling issues.
detectMetamaskInstalled();

//Connect to Metamask.
const ethereumButton = document.querySelector("#enableEthereumButton");
ethereumButton.addEventListener("click", () => {
  detectMetamaskInstalled();
  enableMetamaskOnShardeum();
});

//Make Metamask the client side Web3 provider. Needed for tracking live events.
const web3 = new Web3(window.ethereum);

//Now build the contracts with Web3.

// REQUEST LINK FROM FAUCET
const contractAddress_JS = "0x731637A147a2eFEa91Ced8053667DF61C033DcBE";
const contractABI_JS = [{"inputs":[],"name":"cooldown","type":"error"},{"inputs":[],"name":"faucetNotFunded","type":"error"},{"inputs":[],"name":"useFaucet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userPreviousWithdrawTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

const contractDefined_JS = new web3.eth.Contract(
  contractABI_JS,
  contractAddress_JS
);

const dripWalletAddress = "0xa6d76cb2ad1c948bc8888d348e33c05e4fa90475";

document.getElementById("getContractAddress").innerHTML = contractAddress_JS;

// FUNCTIONS TO RETRIEVE SMART CONTRACT DATA

async function checkContractBalance() {
  try {
    web3.eth.getBalance(contractAddress_JS).then((balanceInWei) => {
      balance = web3.utils.fromWei(balanceInWei);
      console.log("Balance in wei:", balanceInWei);
      console.log("Balance in ETH:", balance);
      document.getElementById("getFaucetLinkBalance").innerHTML =
        balanceInWei / 10 ** 18 + " SHM";
    });
  } catch (error) {
    console.log(error);
  }
}

async function getDripWalletBalance() {
  try {
    web3.eth.getBalance(dripWalletAddress).then((balanceInWei) => {
      balance = web3.utils.fromWei(balanceInWei);
      console.log("Balance in wei:", balanceInWei);
      console.log("Balance in ETH:", balance);
      document.getElementById("getDripWalletAddress").innerHTML =
        balanceInWei / 10 ** 18 + " SHM";
    });
  } catch (error) {
    console.log(error);
  }
}

checkContractBalance();
getDripWalletBalance();

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const changeStateInContractEvent = document.querySelector(
  ".changeStateInContractEvent"
);
changeStateInContractEvent.addEventListener("click", () => {
  checkAddressMissingMetamask();

  contractDefined_JS.methods
    .userPreviousWithdrawTime(accounts[0])
    .call((err, balance) => {
      // if( BigInt(Date.now()) > BigInt((BigInt(balance)+43200n)*1000n) ) {
      //   chainlinkInterfaceERC20_CONTRACT.methods.balanceOf(contractAddress_JS).call((err, contractLINKbalanceResult) => {
      //     if(contractLINKbalanceResult >= "20000000000000000000"){
      ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: accounts[0],
              to: contractAddress_JS,
              data: contractDefined_JS.methods.useFaucet().encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
      //     }else{
      //       alert("NEED AT LEAST 20 LINK IN THE FAUCET! DONATE TO FAUCET ADDRESS ON L16: " + contractAddress_JS)
      //     }
      //   });
      // }else{
      //   alert("NEED TO WAIT THE FULL 12 HOURS AFTER YOUR LAST FAUCET WITHDRAW! SECONDS LEFT: " + BigInt((BigInt((BigInt(balance)+43200n)*1000n) -BigInt(Date.now()))/1000n) )
      // }
    });
});

// Request from the backend faucet
async function airdropRequest() {
  detectMetamaskInstalled();
  checkAddressMissingMetamask();
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  var account = accounts[0];
  var address =
    "https://shardeum-faucet.onrender.com/sendSHM?address=" + account;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      alert(this.responseText);
    }
  });

  xhr.open("POST", address);
  xhr.setRequestHeader("accept", "*/*");

  xhr.send();
}

// //Get the latest event. Once the event is triggered, website will update value.
// contractDefined_JS.events.faucetWithdraw({
//      fromBlock: 'latest'
//  }, function(error, eventResult){})
//  .on('data', function(eventResult){
//    console.log(eventResult)
//    //Call the get function to get the most accurate present state for the value.
//   checkLastDateWithdrawn()
//   //LINK BALANCE
//   chainlinkInterfaceERC20_CONTRACT.methods.balanceOf(contractAddress_JS).call((err, contractLINKbalanceResult) => {
//     if ((contractLINKbalanceResult/(10**18)) == 0){document.getElementById("getFaucetLinkBalance").innerHTML = "The faucet is empty!"}
//     else {document.getElementById("getFaucetLinkBalance").innerHTML = contractLINKbalanceResult/(10**18) + " LINK"}
//   });
//    })
//  .on('changed', function(eventResult){
//      // remove event from local database
//  })
//  .on('error', console.error);
