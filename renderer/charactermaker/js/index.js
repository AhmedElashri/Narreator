//- App Variables
var selectedStory
var selectedCharacter

//- Element Variables
const storyDropdown = document.querySelector("[data-dropdown][data-story]")
const storyDropdownButton = document.querySelector('[data-story-dropbutton]')
const storyDropdownMenu = document.querySelector('[data-story-dropmenu]')

const characterDropdown = document.querySelector("[data-dropdown][data-char]")
const characterDropdownButton = document.querySelector('[data-char-dropbutton]')
const characterDropdownMenu = document.querySelector('[data-char-dropmenu]')

const createStoryTextbox = document.querySelector('[data-cs]')
const createStoryButton = document.querySelector('[data-cs-btn]')

const createCharacterTextbox = document.querySelector('[data-cc]')
const createCharacterButton = document.querySelector('[data-cc-btn]')


//- Functions

function openStoryDropdown() {
  let stories = window.api.getStoryList()
  storyDropdownMenu.innerHTML = ""
  console.log("Loaded Story List: \n")
  console.log(stories)
  stories.forEach(story => {
    storyDropdownMenu.innerHTML += `<div class="drop-item" data-story-dropitem>${story}</div>`
  })
  
  document.querySelectorAll('[data-story-dropitem]').forEach(item => {
    item.addEventListener('click', () => {
      let value = item.innerHTML
      console.log(value + " selected")
      storyDropdownButton.innerHTML = value
      selectedStory = value
      storyDropdown.classList.toggle('active')
      updateCharacterDropdown()
    })
  })
}

async function updateCharacterDropdown() {
  let characters = await window.api.getCharList(selectedStory)
  console.log("Loaded Character List: \n")
  console.log(characters)
  characterDropdownMenu.innerHTML = ""
  characters.forEach(char => {
    characterDropdownMenu.innerHTML += `<div class="drop-item" data-char-dropitem>${char}</div>`
  })
  
}

//- Event Listeners
// Open Dropdown 
document.addEventListener('click', (event) => {
  const isDropdownButton = event.target.matches("[data-story-dropbutton]") || event.target.matches("[data-char-dropbutton]")
  if (!isDropdownButton && event.target.closest("[data-dropdown]") != null) return

  let currentDropdown
  if (isDropdownButton) {
    currentDropdown = event.target.closest('[data-dropdown]')
    currentDropdown.classList.toggle('active')

    if (currentDropdown.hasAttribute("data-story")) {
      openStoryDropdown()
    }
  }

  document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
    if (dropdown === currentDropdown) return
    dropdown.classList.remove('active')
  })
})

// Create Story
createStoryButton.addEventListener('click', () => {
  if (createStoryTextbox.value == "") return
  window.api.newStory(createStoryTextbox.value)
  storyDropdownButton.innerHTML = createStoryTextbox.value
  selectedStory = createStoryTextbox.value
  createStoryTextbox.value = ""
})