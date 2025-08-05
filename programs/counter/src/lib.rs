use anchor_lang::prelude::*;
declare_id!("mBZjzzYth2zGq7kw9TRNXsPTYGLmdMbtc89LCsgoukb");

#[program]
pub  mod counter{
    use super::*;

    pub fn initialize(ctx:Context<Initialize>)->Result<()>{
        ctx.accounts.counter.count=0;
        Ok(())
    }

    pub fn increment(ctx:Context<Update>)->Result<()>{
        ctx.accounts.counter.count=ctx.accounts.counter.count.checked_add(1).ok_or(MyError::Overflow)?;
        Ok(())
    }

    pub fn decrement(ctx:Context<Update>)->Result<()>{
        ctx.accounts.counter.count=ctx.accounts.counter.count.checked_sub(1).ok_or(MyError::Underflow)?;
        Ok(())
    }

    pub fn add(ctx:Context<Add>,value:u8)->Result<()>{
        ctx.accounts.counter.count=ctx.accounts.counter.count.checked_add(value).ok_or(MyError::Overflow)?;
        Ok(())
    }

    pub fn set(ctx:Context<Set>,value:u8)->Result<()>{
        if value > 100 {
        return Err(MyError::InvalidSetValue.into());
        }

        ctx.accounts.counter.count = value;
        Ok(())    
    }

    pub fn close(ctx: Context<Close>) -> Result<()> {
        Ok(())
    }

}

#[error_code]
pub enum MyError{
    #[msg("Counter Overflow")]
    Overflow,

    #[msg("Counter Underflow")]
    Underflow,

    #[msg("Value provided is not allowed")]
    InvalidSetValue,
}


#[account]
#[derive(InitSpace)]
pub struct Counter{
    count:u8
}

#[derive(Accounts)]
pub struct Initialize<'info>{
    #[account(mut)]
    pub user:Signer<'info>,
    pub system_program:Program<'info,System>,

    #[account(
        init,payer=user,space=8+Counter::INIT_SPACE
    )]
    pub counter:Account<'info,Counter>
}

#[derive(Accounts)]
pub struct Update<'info>{
    #[account(mut)]
    pub counter:Account<'info,Counter>
}

#[derive(Accounts)]
pub struct Add<'info>{
    #[account(mut)]
    pub counter:Account<'info,Counter>
}

#[derive(Accounts)]
pub struct Set<'info>{
    #[account(mut)]
    pub counter:Account<'info,Counter>
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, close = user)]
    pub counter: Account<'info, Counter>,
}
