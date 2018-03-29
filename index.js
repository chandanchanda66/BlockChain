const SHA256=require('crypto-js/sha256')
class Transaction{
    constructor(from,to,amount)
    {
        this.from=from;
        this.to=to;
        this.amount=amount;
    }
}
class Block{
  constructor(timestamp,trans,previousHash="")
  {
      this.timestamp=timestamp;
      this.trans=trans;
      this.previousHash=previousHash;
      this.hash=this.calculateHash();
      this.nonce=0;
  }  
  calculateHash()
  {
        return SHA256(this.previousHash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
  }
  mineBlock(difficulty){
      while(this.hash.substring(0,difficulty)!==Array(difficulty + 1).join("0"))
      {
          this.nonce++;
          this.hash=this.calculateHash();
      }
      console.log("Block Mined  "+this.hash)
  }
}
class Blockchain{
    constructor()
    {
        this.chain=[this.createGenesisBlock()];
        this.difficulty=3;
        this.pendingTransaction=[];
        this.minerReward=50;
    }
    createGenesisBlock()
    {
        return new Block("29/03/18","GenesisBlock","0");
    }
    getLatestBlock()
    {
        return this.chain[this.chain.length-1];
    }
    minePendingTransactions(minerRewardaddress)
    {
        let block=new Block(Date.now(),this.pendingTransaction);

        block.mineBlock(this.difficulty);
        block.previousHash=this.getLatestBlock().hash;
        console.log("Block Mined Successfully...")
        this.chain.push(block);
        this.pendingTransaction=[
            new Transaction(null,minerRewardaddress,this.minerReward)
        ];

    }
    createTransaction(transaction)
    {
        this.pendingTransaction.push(transaction);
    }
    getBalanceofAddress(address)
    {
        let Balance=0;
        for(const block of this.chain)
        {
            for(const trans of block.trans)
            {
                if (trans.from===address)
                {
                    Balance-=trans.amount;
                }
                if (trans.to===address)
                {
                    Balance+=trans.amount;
                }
            }
        }
        return Balance;
    }
    ischainValid()
    {
        for(let i=1;i<this.chain.length;i++)
        {
            let currentBlock=this.chain[i];
            let previousBlock=this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
            return true;

        }
        
    }
}
let transaction=new Blockchain();

transaction.createTransaction(new Transaction("john","victor",100));
transaction.createTransaction(new Transaction("victor","john",50));
console.log("starting Miner.......");
transaction.minePendingTransactions("lilly");
console.log("Balance of lilly is "+transaction.getBalanceofAddress("lilly"));
console.log("starting Miner again.......");
transaction.minePendingTransactions("lilly");
console.log("Balance of lilly is "+ transaction.getBalanceofAddress("lilly"));

console.log(JSON.stringify(transaction,null,4))

