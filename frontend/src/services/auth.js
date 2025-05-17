import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import config from '../config';
import { useMockData } from '../config';

// Create the Cognito User Pool
const userPool = new CognitoUserPool({
  UserPoolId: config.userPoolId,
  ClientId: config.userPoolClientId
});

export const signUp = (email, password) => {
  // For mock mode
  if (useMockData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        window.mockUser = { email, sub: 'mock-user-id' };
        resolve({ username: email });
      }, 1000);
    });
  }

  // Real implementation for AWS
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result.user);
    });
  });
};

export const confirmSignUp = (email, code) => {
  // For mock mode
  if (useMockData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('SUCCESS');
      }, 1000);
    });
  }

  // Real implementation for AWS
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const signIn = (email, password) => {
  // For mock mode
  if (useMockData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        window.mockUser = { email, sub: 'mock-user-id' };
        resolve({ idToken: { jwtToken: 'mock-token' } });
      }, 1000);
    });
  }

  // Real implementation for AWS
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      }
    });
  });
};

export const signOut = () => {
  // For mock mode
  if (useMockData) {
    window.mockUser = null;
    return;
  }

  // Real implementation for AWS
  const currentUser = userPool.getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
  }
};

export const getCurrentUser = () => {
  // For mock mode
  if (useMockData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (window.mockUser) {
          resolve(window.mockUser);
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  // Real implementation for AWS
  return new Promise((resolve, reject) => {
    const currentUser = userPool.getCurrentUser();

    if (!currentUser) {
      resolve(null);
      return;
    }

    currentUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }

      if (!session.isValid()) {
        resolve(null);
        return;
      }

      currentUser.getUserAttributes((err, attributes) => {
        if (err) {
          resolve(null);
          return;
        }

        const userData = {};
        for (let i = 0; i < attributes.length; i++) {
          userData[attributes[i].getName()] = attributes[i].getValue();
        }

        resolve({
          ...userData,
          username: currentUser.getUsername(),
          token: session.getIdToken().getJwtToken()
        });
      });
    });
  });
};

export const getToken = () => {
  // For mock mode
  if (useMockData) {
    return Promise.resolve('mock-token');
  }

  // Real implementation for AWS
  return new Promise((resolve, reject) => {
    const currentUser = userPool.getCurrentUser();

    if (!currentUser) {
      resolve(null);
      return;
    }

    currentUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(session.getIdToken().getJwtToken());
    });
  });
};

export const isAuthenticated = async () => {
  // For mock mode
  if (useMockData) {
    return !!window.mockUser;
  }

  // Real implementation for AWS
  const user = await getCurrentUser();
  return !!user;
};