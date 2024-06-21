const accountModel = require('../modal/account');
const {createHash,validatePass,createToken} = require('../utils/comman');


const addAccount = async (req, res) => {
    try {
        let {email, first_name, last_name, phone, birthday} = req.body;
        let emailExist =  await accountModel.accountModel.findOne({email : email}).select('_id email');
        console.log(emailExist);
        if(emailExist){
            return res.status(400).json({
                message: "Email already exist",
              });
    
        }
        let password = (req.body.password)
        let signUp = accountModel.accountModel({ first_name, last_name,email,birthday,phone,password });
        let result = await signUp.save();
        return res
          .status(200)
          .json({ message: "signUp sucessfully", data: result });
    } catch (error) {
        console.log(error,"OOO");
        return res.status(400).json({
            message: "something went wrong",
            error: error,
          });
      
    }
    
    }
const getAccount = async (req, res) => {
    try {
            let {id} = req.params;
            let accountData = await accountModel.accountModel.findOne({_id :id,isDel:false});
            if(accountData){
    
                    return res
                    .status(200)
                    .json({ message: "Account fetched  sucessfully", data: accountData });
          
    
                }else{
                   return res
                .status(200)
                .json({ message: "Account not exist "});
    
                }
    
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message: "something went wrong",
                error: error,
              });
          
        }
        
    }
    
const getAllAccount = async (req, res) => {
        let { limit, pageNo } = req.query;
        limit = parseInt(limit) || 10; // Default limit to 10 if not provided
        pageNo = parseInt(pageNo) || 1; // Default pageNo to 1 if not provided
        
        try {
           const skip = (pageNo - 1) * limit;
         const accountData = await accountModel.accountModel.find({isDel:false})
                .limit(limit)
                .skip(skip);
            
            const totalAccounts = await accountModel.accountModel.countDocuments({});
            const totalPages = Math.ceil(totalAccounts / limit);
    
            if (accountData) {
                return res
                    .status(200)
                    .json({
                        message: "Accounts fetched successfully",
                        data: accountData,
                        pagination: {
                            totalAccounts,
                            totalPages,
                            currentPage: pageNo,
                          
                        }
                    });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message: "Something went wrong",
                error: error,
            });
        }
    }

const updateAccount = async (req, res) => {
        try {
            const { first_name, last_name, email, phone, birthday } = req.body;
            if (!first_name || !last_name || !email || !phone || !birthday) {
                return res.status(400).json({ error: 'All fields (first_name, last_name, email, phone, birthday) are required' });
            }
    
            
            const account = await accountModel.accountModel.findByIdAndUpdate(
                req.params.id,
                { first_name, last_name, email, phone, birthday, last_modified: new Date() },
                { new: true, runValidators: true }
            );
    
            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }
    
            res.json(account);
    
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error updating account:', error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    };
      

    const removeAccount = async (req, res) => {
        try {
                let {id} = req.params;
                let accountData = await accountModel.accountModel.findByIdAndUpdate(req.params.id,
                    { isDel: true },
                    { new: true, runValidators: true });
                if(accountData){
        
                        return res
                        .status(200)
                        .json({ message: "Account Removed  sucessfully"});
              
        
                    }else{
                       return res
                    .status(200)
                    .json({ message: "user found"});
        
                    }
        
            } catch (error) {
                console.log(error);
                return res.status(400).json({
                    message: "something went wrong",
                    error: error,
                  });
              
            }
            
        }   
const login = async (req, res) => {
        try {
                let {email,password} = req.body;
                let userData = await accountModel.accountModel.findOne({email:email});
                if(userData){
                    let validatePassword = await validatePass({password :password,hash :userData.password});
                    if(validatePassword){
                        let token  = await createToken(userData);
                        await accountModel.accountModel.findOneAndUpdate({_id:userData._id },{$set : {accessToken : token}})
        
                        return res
                        .status(200)
                        .json({ message: "Login sucessfully",accessToken : token, data: userData });
              
        
                    }else{
                       return res
                    .status(400)
                    .json({ message: "Password does not matched"});
        
                    }
        
                }else{
                   return res
                    .status(200)
                    .json({ message: "user not found"});
                }
            } catch (error) {
                console.log(error);
                return res.status(400).json({
                    message: "something went wrong",
                    error: error,
                  });
              
            }
            
    }



module.exports = {
    addAccount,
    getAccount,
    getAllAccount,
    updateAccount,
    removeAccount,
    login,
    
}


