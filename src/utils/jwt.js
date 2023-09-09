import jwt from "jsonwebtoken";
const accessTokenSecret = process.env.APP_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export function signAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { payload },
      accessTokenSecret,
      { expiresIn: "15s" },
      (err, token) => {
        if (err) {
          reject("Something went wrong");
        }
        resolve(token);
      }
    );
  });
}

export function verifyAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, accessTokenSecret, (err, payload) => {
      if (err) {
        const message =
          err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
        return reject(message);
      }
      resolve(payload);
    });
  });
}

// refresh token things

export function signRefreshToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign({ payload }, accessTokenSecret, {}, (err, token) => {
      if (err) {
        reject("Something went wrong");
      }
      resolve(token);
    });
  });
}


export function verifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, refreshTokenSecret, (err, payload) => {
      if (err) {
        const message =
          err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
        return reject(message);
      }
      resolve(payload);
    });
  });
}

// lets talk about refresh tokens
// please note that middleware is executed first, and after that the callback function for the endpoiint is run

// why refresh tokens?
// we need it cause we can save this refreshtoken in a safe spot, and then we do expiry date for our accesstokens (we'll call it tokens for now). so assume a hacker wants to hack, they can get our token, but since it'll expire, they only have a short while to our account. after token expires, they cant log into our account anymore. For us, once the token expires, we have a refresh token which means that we will generate a new valid access token, and this is where our isloggedin function comes in. the isloggedin checks if we have a token, then we verify token with middleware, and then set our localstorage with that refreshtoken and accesstoken

// issues
// have to store refreshtokens related to user - update schema
// when we logout, it will empty all the refreshtokens, and also the tokens - have to update on schema
// when we login, it will bind user to that refreshtoken
// otherwise, if no login or logout button pressed, they will have the same refreshtoken, and hence that refreshtoken will be valid, and we will generate an accesstoken to be able to login/be logged in.

// things to note
// ah so yeah, if im not mistaken, if someone has our accesstoken, they can always login into our page, but they cant do jackshit in it. this is because for shits which matter, we will add an auth to it, and for the auth part, they will need to verify their tokens and shit! haha then the hackers wont have access to that anymore

// to-do
// 1.
// lets create new field refreshTokens for user table. it must be unique and can be null
// now when we create a refreshtoken in our auth endpoint(aka when we login), we want to push this refreshToken to the database as the refreshtoken for that user.. note, refreshtoken can be null or be of anothervalue. (DONE)

// next up
// our is loggedin endpoint

// later
// if a user doesnt logout, the refresh token will always be there
