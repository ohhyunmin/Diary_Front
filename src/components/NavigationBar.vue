<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- 로고 -->
      <div class="nav-logo">
        <a href="/">MyApp</a>
      </div>

      <!-- 네비게이션 메뉴 -->
      <ul class="nav-menu" :class="{ active: isMenuOpen }">
        <li class="nav-item">
          <a href="/" class="nav-link" :class="{ active: currentRoute === '/' }" @click="closeMenu">Home</a>
        </li>
        <li class="nav-item">
          <a href="/about" class="nav-link" :class="{ active: currentRoute === '/about' }" @click="closeMenu">About</a>
        </li>
        <li class="nav-item">
          <a href="/services" class="nav-link" :class="{ active: currentRoute === '/services' }" @click="closeMenu">Services</a>
        </li>
        <li class="nav-item">
          <a href="/contact" class="nav-link" :class="{ active: currentRoute === '/contact' }" @click="closeMenu">Contact</a>
        </li>
        <li class="nav-item">
          <button class="nav-btn" @click="openLogin">로그인</button>
        </li>
      </ul>
    </div>
  </nav>

  <LoginModal 
      :show="showLoginModal" 
      @close="closeModal"
    />
  
</template>

<script>
import LoginModal from './LoginModal.vue'

export default {
  name: 'NavigationBar',
  data() {
    return {
      isMenuOpen: false,
      currentRoute: '/',
      showLoginModal: false,
      loginForm: {
        email: '',
        password: '',
        remember: false
      }
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    },
    openLogin() {
      this.showLoginModal = true
      this.closeMenu()
    },
    closeModal() {
      this.showLoginModal = false
    }
  },
  components: {
    LoginModal
  },
  mounted() {
    // 현재 경로 감지 (실제로는 Vue Router 사용 권장)
    this.currentRoute = window.location.pathname
  }
}
</script>

<style scoped>
.navbar {
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 20px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-logo a {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-logo a:hover {
  color: #42b983;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
  align-items: center;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.3s;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #42b983;
  transition: width 0.3s;
}

.nav-link:hover {
  color: #42b983;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: #359268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  gap: 5px;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: #2c3e50;
  transition: all 0.3s;
  border-radius: 3px;
}

.nav-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.nav-toggle.active span:nth-child(2) {
  opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #333;
}

.modal-header {
  text-align: center;
  margin-bottom: 30px;
}

.modal-header h2 {
  font-size: 28px;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.modal-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #666;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
}

.forgot-password {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.login-btn:hover {
  background: #359268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.modal-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.modal-footer p {
  color: #666;
  font-size: 14px;
}

.signup-link {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
}

.signup-link:hover {
  text-decoration: underline;
}

/* 모달 애니메이션 */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    left: -100%;
    top: 70px;
    flex-direction: column;
    background: #ffffff;
    width: 100%;
    text-align: center;
    transition: left 0.3s;
    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.1);
    padding: 20px 0;
    gap: 0;
  }

  .nav-menu.active {
    left: 0;
  }

  .nav-item {
    width: 100%;
    padding: 15px 0;
  }

  .nav-link::after {
    display: none;
  }

  .nav-btn {
    width: 80%;
    margin-top: 10px;
  }

  .modal-container {
    padding: 30px 20px;
  }

  .modal-header h2 {
    font-size: 24px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>