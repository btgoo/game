print('hi mom');

// Helper function to print to the screen.
function print(line) {
  const appDiv = document.getElementById('app');
  const div = document.createElement('div');
  div.innerHTML = line;
  appDiv.appendChild(div);
}