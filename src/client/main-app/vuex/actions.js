// Background
export const updateBackground = makeAction('UPDATE_BACKGROUND')
export const toggleBackgroundLock = makeAction('TOGGLE_BACKGROUND_LOCK')
export const toggleBackgroundVisibility = makeAction('TOGGLE_BACKGROUND_VISIBILITY')
export const updateBackgroundOpacity = makeAction('UPDATE_BACKGROUND_OPACITY')

// Wall
export const addWall = makeAction('ADD_WALL')
export const removeWall = makeAction('REMOVE_WALL')
export const toggleWallVisibility = makeAction('TOGGLE_WALL_VISIBILITY')
export const toggleWallLock = makeAction('TOGGLE_WALL_LOCK')

// Window
export const addWindow = makeAction('ADD_WINDOW')
export const removeWindow = makeAction('REMOVE_WINDOW')
export const toggleWindowVisibility = makeAction('TOGGLE_WINDOW_VISIBILITY')
export const toggleWindowLock = makeAction('TOGGLE_WINDOW_LOCK')

// Door
export const addDoor = makeAction('ADD_DOOR')
export const removeDoor = makeAction('REMOVE_DOOR')
export const toggleDoorVisibility = makeAction('TOGGLE_DOOR_VISIBILITY')
export const toggleDoorLock = makeAction('TOGGLE_DOOR_LOCK')

function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}
