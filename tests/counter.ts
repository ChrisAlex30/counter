import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { startAnchor, BankrunProvider } from "anchor-bankrun";
import { Counter } from "../target/types/counter";
import IDL from "../target/idl/counter.json" ;
import {expect} from "chai";
import * as anchor from "@coral-xyz/anchor";


describe("Counter Program",()=>{
  let provider: BankrunProvider;
  let program: Program<Counter>;
  let counterAccount = Keypair.generate();

  const counterProgramId = new PublicKey("mBZjzzYth2zGq7kw9TRNXsPTYGLmdMbtc89LCsgoukb"); 
  let user :anchor.Wallet;

  before(async () => {
    const context = await startAnchor("", [
      { name: "counter", programId: counterProgramId },
    ],[]);

    provider = new BankrunProvider(context);
    user = provider.wallet;
    program = new Program<Counter>(IDL as Counter,  provider);

  });
  it("Initialize Counter",async()=>{
      await program.methods.initialize().accounts({
        user:user.publicKey,
        counter:counterAccount.publicKey
      }).signers([counterAccount]).rpc();

      const counter=await program.account.counter.fetch(counterAccount.publicKey);
      console.log({counter});

      expect(counter.count).equal(0); 
      
    });

  it("Increment the counter",async ()=>{
    await program.methods.increment().accounts({
      counter:counterAccount.publicKey
    }).rpc();

    const counter=await program.account.counter.fetch(counterAccount.publicKey);
    console.log(counter);

    expect(counter.count).equal(1);
    
  });

  it("Decrement the counter",async ()=>{
    await program.methods.decrement().accounts({
      counter:counterAccount.publicKey
    }).rpc();

    const counter=await program.account.counter.fetch(counterAccount.publicKey);
    console.log(counter);

    expect(counter.count).equal(0);
    
  })

  it("Adds to the counter",async ()=>{
    await program.methods.add(10).accounts({
      counter:counterAccount.publicKey
    }).rpc();

    const counter=await program.account.counter.fetch(counterAccount.publicKey);
    console.log(counter);

    expect(counter.count).equal(10);
    
  })

  it("Set the counter",async ()=>{
    await program.methods.set(50).accounts({
      counter:counterAccount.publicKey
    }).rpc();

    const counter=await program.account.counter.fetch(counterAccount.publicKey);
    console.log(counter);

    expect(counter.count).equal(50);
    
  })

  it("Closes the counter", async () => {
  await program.methods
    .close()
    .accounts({
      user: user.publicKey,
      counter: counterAccount.publicKey,
    })
    .rpc();

  try {
    await program.account.counter.fetch(counterAccount.publicKey);
    // If fetch doesn't throw, the test should fail
    throw new Error("Counter account still exists after close.");
  } catch (err) {
    // This is the expected behavior
    expect(err.message).to.contain("Could not find");
  }
});

})



























// import * as anchor from "@coral-xyz/anchor";
// import {Program} from "@coral-xyz/anchor";
// import {Counter} from "../target/types/counter";
// import {expect} from "chai";

// describe("Counter Program",()=>{
//   const provider=anchor.AnchorProvider.env();
//   anchor.setProvider(provider);

//   const program=anchor.workspace.Counter as Program<Counter>;

//   const user=provider.wallet;
//   let counterAccount=anchor.web3.Keypair.generate();

//   it("Initialize Counter",async()=>{
//       await program.methods.initialize().accounts({
//         user:user.publicKey,
//         counter:counterAccount.publicKey
//       }).signers([counterAccount]).rpc();

//       const counter=await program.account.counter.fetch(counterAccount.publicKey);
//       console.log({counter});

//       expect(counter.count).equal(0); 
      
//     });

//   it("Increment the counter",async ()=>{
//     await program.methods.increment().accounts({
//       counter:counterAccount.publicKey
//     }).rpc();

//     const counter=await program.account.counter.fetch(counterAccount.publicKey);
//     console.log(counter);

//     expect(counter.count).equal(1);
    
//   });

//   it("Decrement the counter",async ()=>{
//     await program.methods.decrement().accounts({
//       counter:counterAccount.publicKey
//     }).rpc();

//     const counter=await program.account.counter.fetch(counterAccount.publicKey);
//     console.log(counter);

//     expect(counter.count).equal(0);
    
//   })

//   it("Adds to the counter",async ()=>{
//     await program.methods.add(10).accounts({
//       counter:counterAccount.publicKey
//     }).rpc();

//     const counter=await program.account.counter.fetch(counterAccount.publicKey);
//     console.log(counter);

//     expect(counter.count).equal(10);
    
//   })

//   it("Set the counter",async ()=>{
//     await program.methods.set(50).accounts({
//       counter:counterAccount.publicKey
//     }).rpc();

//     const counter=await program.account.counter.fetch(counterAccount.publicKey);
//     console.log(counter);

//     expect(counter.count).equal(50);
    
//   })

//   it("Closes the counter", async () => {
//   await program.methods
//     .close()
//     .accounts({
//       user: user.publicKey,
//       counter: counterAccount.publicKey,
//     })
//     .rpc();

//   try {
//     await program.account.counter.fetch(counterAccount.publicKey);
//     // If fetch doesn't throw, the test should fail
//     throw new Error("Counter account still exists after close.");
//   } catch (err) {
//     // This is the expected behavior
//     expect(err.message).to.contain("Account does not exist");
//   }
// });

// })







