import ADD_LISTS from './ActionTypes'

export const getLists = () => (dispatch) => {

    return fetch('https://musicboss-app.herokuapp.com/api/listas/', {
        method: 'GET'
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(response => dispatch(addLists(response)))
    .catch(error => { console.log('Post comments ', error.message);
        alert('Your comment could not be posted\nError: '+ error.message); })
}

export const addLists = (lists) => ({
    type: ActionTypes.ADD_LISTS,
    payload: lists
});