const character = document.getElementById('character');
const canvas = document.getElementById('gameCanvas');
const background = document.getElementById('background');
let posX = 375; // Character's horizontal position
let posY = 50; // Character's vertical position
let isJumping = false;
let jumpCount = 0; // To track the number of jumps
const maxJumps = 2; // Allow double jumps
const groundLevel = 50; // The bottom position of the character
const jumpHeight = 100; // Maximum height of the jump
const gravity = 5; // How fast the character falls
const jumpSpeed = 20; // How fast the character rises
const moveSpeed = 10; // Speed of horizontal movement

// State for key presses
let isMovingRight = false;
let isMovingLeft = false;
let facingRight = true; // Track which direction the character is facing

character.style.left = posX + 'px';
character.style.bottom = posY + 'px'; // Set initial position

// Camera offset to move the background
let cameraOffset = 0;
const canvasWidth = canvas.clientWidth; // Width of the canvas

// Handle keydown events for movement and jumping
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        isMovingRight = true; // Set right movement flag
        facingRight = true; // Character faces right
    } else if (e.key === 'ArrowLeft') {
        isMovingLeft = true; // Set left movement flag
        facingRight = false; // Character faces left
    } else if (e.key === 'ArrowUp' && jumpCount < maxJumps) {
        jump(); // Jump if under max jumps
    } else if (e.key === ' ') {
        shoot(); // Shoot when space is pressed
    }
});

// Handle keyup events to stop movement
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') {
        isMovingRight = false; // Clear right movement flag
    } else if (e.key === 'ArrowLeft') {
        isMovingLeft = false; // Clear left movement flag
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        isMovingRight = true; // Set right movement flag
        facingRight = true; // Character faces right
    } else if (e.key === 'ArrowLeft') {
        isMovingLeft = true; // Set left movement flag
        facingRight = false; // Character faces left
    } else if (e.key === 'ArrowUp' && jumpCount < maxJumps) {
        jump(); // Jump if under max jumps
    } else if (e.key === ' ') {
        shoot(); // Shoot when space is pressed
    }
});





// Continuous movement update
function updatePosition() {
    // Check for collisions BEFORE updating the position
    if (!isColliding(character)) {
        if (isMovingRight) {
            posX += moveSpeed; // Move right
        } 
        if (isMovingLeft) {
            posX -= moveSpeed; // Move left
        }

        // Keep character within horizontal bounds
        posX = Math.max(0, Math.min(canvas.clientWidth - character.clientWidth, posX));
    } else {
        // Adjust the position or stop the movement on collision
        if (isMovingRight) {
            posX -= moveSpeed; // Move back if colliding from the right
        } else if (isMovingLeft) {
            posX += moveSpeed; // Move back if colliding from the left
        }
    }

    // Update the character's position
    character.style.left = posX + 'px';

    // Update vertical position
    character.style.bottom = posY + 'px';
}


// Jump function
function jump() {
    if (jumpCount >= maxJumps) return; // Prevent jumping more than twice
    isJumping = true;
    jumpCount++;

    let jumpInterval = setInterval(() => {
        // Only jump if we're still below the max jump height
        if (posY < groundLevel + jumpHeight) {
            posY += jumpSpeed; // Jump up
        } else {
            clearInterval(jumpInterval);
            fall(); // Start falling after reaching the max jump height
        }

        // Update vertical position
        character.style.bottom = posY + 'px';
        updatePosition(); // Update horizontal position
    }, 20);
}



// Fall function
function fall() {
    let fallInterval = setInterval(() => {
        if (!isColliding(character)) { // Only fall if not colliding with a platform
            if (posY > groundLevel) {
                posY -= gravity; // Fall down
            } else {
                clearInterval(fallInterval);
                posY = groundLevel; // Reset to ground level
                isJumping = false; // Allow jumping again
                jumpCount = 0; // Reset jump count on landing
            }
        } else {
            clearInterval(fallInterval); // Stop falling once the character hits a platform
            isJumping = false; // Reset jumping status
            jumpCount = 0; // Reset jump count when landing on a platform
        }

        // Update positions
        character.style.bottom = posY + 'px';
        updatePosition(); // Update horizontal position
    }, 20);
}





// Shoot function
function shoot() {
    const ball = document.createElement('div'); // Create a new div for the ball
    ball.className = 'ball'; // Add a class for styling
    ball.style.left = (posX + (character.clientWidth / 2) - 5) + 'px'; // Center the ball
    ball.style.bottom = (posY + 20) + 'px'; // Start above the character
    document.getElementById('gameCanvas').appendChild(ball); // Add ball to the canvas

    // Determine the direction based on the current facing direction
    const direction = facingRight ? 5 : -5; // Move right or left

    let moveBallInterval = setInterval(() => {
        let ballPosX = parseInt(ball.style.left);
        ballPosX += direction; // Move the ball based on the initial direction

        // Update ball position
        ball.style.left = ballPosX + 'px';

        // Remove the ball if it goes off-screen
        if (ballPosX < 0 || ballPosX > canvas.clientWidth) {
            clearInterval(moveBallInterval);
            ball.remove(); // Remove the ball from the DOM
        }
    }, 20);
}

// Continuous position update
setInterval(updatePosition, 20);

function isColliding(character) {
    const collidables = document.querySelectorAll('.collidable');
    const characterRect = character.getBoundingClientRect();

    for (const collidable of collidables) {
        const collidableRect = collidable.getBoundingClientRect();

        // Check if the character's bottom is above the platform and falling onto it
        if (
            characterRect.x < collidableRect.x + collidableRect.width &&
            characterRect.x + characterRect.width > collidableRect.x &&
            characterRect.bottom <= collidableRect.top + gravity && // Ensure character is falling from above
            characterRect.bottom + gravity > collidableRect.top
        ) {
            // Adjust the character's position to sit on top of the platform
            posY = canvas.clientHeight - (collidableRect.height + collidableRect.top);
            isJumping = false; // Reset jumping status
            jumpCount = 0; // Reset jump count
            return true; // Collision detected
        }
    }
    return false; // No collision
}





function updatePosition() {
    if (isMovingRight) {
        posX += moveSpeed; // Move right
    } 
    if (isMovingLeft) {
        posX -= moveSpeed; // Move left
    }

    // Keep character within horizontal bounds
    posX = Math.max(0, Math.min(canvas.clientWidth - character.clientWidth, posX));
    
    // Update the character's position
    character.style.left = posX + 'px';

    // Check for collisions
    if (isColliding(character)) {
        // Handle collision (e.g., stop movement, reset position, etc.)
        if (isMovingRight) {
            posX -= moveSpeed; // Move back if colliding
        } else if (isMovingLeft) {
            posX += moveSpeed; // Move back if colliding
        }
    }

    // Update vertical position
    character.style.bottom = posY + 'px';
}

