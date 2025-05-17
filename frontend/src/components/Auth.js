import { signIn, signUp, confirmSignUp } from '../services/auth';

export default class Auth {
  constructor(container) {
    this.container = container;
    this.email = '';
    this.render();
    this.registerEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="auth-container">
        <div class="card">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs auth-tabs">
              <li class="nav-item">
                <a class="nav-link active" id="signin-tab" href="#signin">Sign In</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="signup-tab" href="#signup">Sign Up</a>
              </li>
              <li class="nav-item d-none">
                <a class="nav-link" id="confirm-tab" href="#confirm">Confirm</a>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <div id="auth-error" class="alert alert-danger d-none"></div>
            <div id="auth-success" class="alert alert-success d-none"></div>
            
            <!-- Sign In Form -->
            <form id="signin-form">
              <div class="form-group">
                <label for="signin-email">Email</label>
                <input type="email" class="form-control" id="signin-email" required>
              </div>
              <div class="form-group">
                <label for="signin-password">Password</label>
                <input type="password" class="form-control" id="signin-password" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Sign In</button>
            </form>
            
            <!-- Sign Up Form -->
            <form id="signup-form" class="d-none">
              <div class="form-group">
                <label for="signup-email">Email</label>
                <input type="email" class="form-control" id="signup-email" required>
              </div>
              <div class="form-group">
                <label for="signup-password">Password</label>
                <input type="password" class="form-control" id="signup-password" required 
                       pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$">
                <small class="form-text text-muted">
                  Password must be at least 8 characters, include at least one uppercase letter, 
                  one lowercase letter, and one number.
                </small>
              </div>
              <div class="form-group">
                <label for="signup-password-confirm">Confirm Password</label>
                <input type="password" class="form-control" id="signup-password-confirm" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
            </form>
            
            <!-- Confirmation Form -->
            <form id="confirm-form" class="d-none">
              <div class="form-group">
                <label for="confirm-email">Email</label>
                <input type="email" class="form-control" id="confirm-email" readonly>
              </div>
              <div class="form-group">
                <label for="confirm-code">Confirmation Code</label>
                <input type="text" class="form-control" id="confirm-code" required>
                <small class="form-text text-muted">
                  Please check your email for the confirmation code.
                </small>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Confirm</button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  registerEventListeners() {
    // Tab navigation
    document.getElementById('signin-tab').addEventListener('click', (e) => {
      e.preventDefault();
      this.showForm('signin');
    });
    
    document.getElementById('signup-tab').addEventListener('click', (e) => {
      e.preventDefault();
      this.showForm('signup');
    });
    
    document.getElementById('confirm-tab').addEventListener('click', (e) => {
      e.preventDefault();
      this.showForm('confirm');
    });
    
    // Sign In Form Submit
    document.getElementById('signin-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignIn();
    });
    
    // Sign Up Form Submit
    document.getElementById('signup-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignUp();
    });
    
    // Confirm Form Submit
    document.getElementById('confirm-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleConfirm();
    });
  }
  
  showForm(formType) {
    // Hide all forms
    document.getElementById('signin-form').classList.add('d-none');
    document.getElementById('signup-form').classList.add('d-none');
    document.getElementById('confirm-form').classList.add('d-none');
    
    // Deactivate all tabs
    document.getElementById('signin-tab').classList.remove('active');
    document.getElementById('signup-tab').classList.remove('active');
    document.getElementById('confirm-tab').classList.remove('active');
    
    // Show selected form and activate tab
    document.getElementById(`${formType}-form`).classList.remove('d-none');
    document.getElementById(`${formType}-tab`).classList.add('active');
    
    // Clear error and success messages
    this.hideError();
    this.hideSuccess();
  }
  
  showError(message) {
    const errorElement = document.getElementById('auth-error');
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
  }
  
  hideError() {
    document.getElementById('auth-error').classList.add('d-none');
  }
  
  showSuccess(message) {
    const successElement = document.getElementById('auth-success');
    successElement.textContent = message;
    successElement.classList.remove('d-none');
  }
  
  hideSuccess() {
    document.getElementById('auth-success').classList.add('d-none');
  }
  
  async handleSignIn() {
    try {
      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;
      
      this.hideError();
      this.showSuccess('Signing in...');
      
      await signIn(email, password);
      
      this.showSuccess('Sign in successful! Redirecting...');
      
      // Reload the page to show the authenticated view
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Sign in error:', error);
      this.hideSuccess();
      this.showError(error.message || 'Failed to sign in. Please try again.');
    }
  }
  
  async handleSignUp() {
    try {
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-password-confirm').value;
      
      if (password !== confirmPassword) {
        this.showError('Passwords do not match.');
        return;
      }
      
      this.hideError();
      this.showSuccess('Signing up...');
      
      await signUp(email, password);
      
      this.email = email;
      document.getElementById('confirm-email').value = email;
      
      this.showSuccess('Sign up successful! Please check your email for confirmation code.');
      
      // Show confirmation form
      document.getElementById('confirm-tab').parentElement.classList.remove('d-none');
      this.showForm('confirm');
    } catch (error) {
      console.error('Sign up error:', error);
      this.hideSuccess();
      this.showError(error.message || 'Failed to sign up. Please try again.');
    }
  }
  
  async handleConfirm() {
    try {
      const email = document.getElementById('confirm-email').value;
      const code = document.getElementById('confirm-code').value;
      
      this.hideError();
      this.showSuccess('Confirming...');
      
      await confirmSignUp(email, code);
      
      this.showSuccess('Account confirmed! You can now sign in.');
      
      // Show sign in form
      setTimeout(() => {
        this.showForm('signin');
      }, 1500);
    } catch (error) {
      console.error('Confirmation error:', error);
      this.hideSuccess();
      this.showError(error.message || 'Failed to confirm account. Please try again.');
    }
  }
}