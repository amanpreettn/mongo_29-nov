const { UserModel } = require("../model");

http://localhost:3000/auth/facebook/secrets
Client_Id:613790053001139
clinet_Secrete:21eda68f8a06dab92cc13b42b8c2dfad

passport.use(new FacebookStrategy({
    clientID:"613790053001139",
    clientSecret: "21eda68f8a06dab92cc13b42b8c2dfa",
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    UserModel.findorcreate({facebookId:profile.id},(err,user)=>{
        return cb(err,user)
    })
  }
));