import React, { useState } from 'react';
import Header from './home/Header';
import Hero from './home/Hero';
import Features from './home/Features';
import Projects from './home/Projects';
import Footer from './home/Footer';
import LoginModal from './home/LoginModal';
import SignupModal from './home/SignupModal';

function Home() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
  
    const openLoginModal = () => {
      setShowLoginModal(true);
      setShowSignupModal(false);
    };
  
    const closeLoginModal = () => {
      setShowLoginModal(false);
    };
  
    const openSignupModal = () => {
      setShowSignupModal(true);
      setShowLoginModal(false);
    };
  
    const closeSignupModal = () => {
      setShowSignupModal(false);
    };
  
    const switchToSignup = () => {
      setShowLoginModal(false);
      setShowSignupModal(true);
    };
  
    const switchToLogin = () => {
      setShowSignupModal(false);
      setShowLoginModal(true);
    };
  
    return (
      <div className="App">
        <Header openLoginModal={openLoginModal} openSignupModal={openSignupModal} />
        <Hero openSignupModal={openSignupModal} />
        <Features />
        <Projects />
        <Footer />
  
        {showLoginModal &&
          <LoginModal
            closeLoginModal={closeLoginModal}
            switchToSignup={switchToSignup}
          />
        }
  
        {showSignupModal &&
          <SignupModal
            closeSignupModal={closeSignupModal}
            switchToLogin={switchToLogin}
          />
        }
      </div>
    );
  }
  
  export default Home;