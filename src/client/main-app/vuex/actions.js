// Background
export const updateBackground = makeAction('UPDATE_BACKGROUND')
export const toggleBackgroundLock = makeAction('TOGGLE_BACKGROUND_LOCK')
export const toggleBackgroundVisibility = makeAction('TOGGLE_BACKGROUND_VISIBILITY')
export const updateBackgroundOpacity = makeAction('UPDATE_BACKGROUND_OPACITY')

// Wall
export const addWall = makeAction('ADD_WALL')
export const removeWall = makeAction('REMOVE_WALL')

// Window
export const addWindow = makeAction('ADD_WINDOW')
export const removeWindow = makeAction('REMOVE_WINDOW')

// Door
export const addDoor = makeAction('ADD_DOOR')
export const removeDoor = makeAction('REMOVE_DOOR')

function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}
