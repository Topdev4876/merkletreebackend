const {MerkleTree} = require('merkletreejs');
const keccak256 = require('keccak256')
const express = require('express')
const cors = require('cors')

const bodyParser = require('body-parser');

const app = express()
app.use(express.json())
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let addresses = [
    "0xa2fdbff693e9497b90de8f7867e0b41b4f405854",
    "0x8d6658AFae060ACe1059Cf732247C6EAF516EfBb",
    "0x335ef9F3aa5471f07dB1D6C73cA6557472E7d976",
    "0xa3dfb05006444e6e0058f5c302b5fb626e7d792c",
    "0xf3b21a531aa69acaff5446ea06de04419c8a2b16",
    "0x8d6658afae060ace1059cf732247c6eaf516efbb",
    "0xce9659d0D1821aF4b575d058dd670eff851826ce"
]

// Hash leaves
let leaves = addresses.map(addr => keccak256(addr))

// Create tree
let merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true})
let rootHash = merkleTree.getRoot().toString('hex')

console.log(merkleTree.toString())
console.log(rootHash)


app.post('/whitelister', async (req,res)=>{
    const {whitelister} = req.body
    console.log("whitelister ===>", req.body.whitelister)
    let hashedAddress = keccak256(whitelister)
    let proof = merkleTree.getHexProof(hashedAddress)
    console.log("result ====>", proof)
    res.send(proof)
})

app.listen(process.env.PORT ||10001,()=>console.log("Listening 10001"))