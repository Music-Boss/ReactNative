import * as ActionTypes from './ActionTypes';

export const Lists = (state = {
        isLoading: true,
        errMess: null,
        dishes: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_LISTS:
            return {...state, isLoading: false, errMess: null, lists: action.payload};

        default:
            return state;
    }
}