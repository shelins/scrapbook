let currentUser = null;

auth.onAuthStateChanged(user => {
  currentUser = user;
  document.getElementById("userStatus").textContent = user
    ? `Signed in as ${user.displayName || user.email}`
    : "Not signed in";
  if (user) loadUserPages();
});

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => alert("❌ " + err.message));
}

function signOut() {
  auth.signOut().then(() => alert("👋 Signed out"));
}
