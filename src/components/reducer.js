export const initialState = {
    user: null,
    profilePic : null
    // user: {
    //     fullName : "Ayush Ray",
    //     userId : "764",
    //     username: "@rayush333",
    //     email : "ray.ayush333@gmail.com",
    //     description: "Just me!",
    //     dob : "24/01/2001",
    //     profilePic : "https://scontent.fixe4-1.fna.fbcdn.net/v/t39.30808-6/236141644_1871936996317441_4656979580538207354_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=NnQ-mVb-pTUAX9RseSf&_nc_ht=scontent.fixe4-1.fna&oh=00_AT9tybaWIxyFy2DaC2GIrqQpmgLLX86wCdHTSWDyuS-JJg&oe=62E317C3",
    //     gender: "Male",
    //     relationshipStatus: "Single",
    //     feed : [{
    //         profilePic : 'https://scontent.fixe1-3.fna.fbcdn.net/v/t39.30808-6/236141644_1871936996317441_4656979580538207354_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=XjopkA4E0RUAX-tHxqI&_nc_ht=scontent.fixe1-3.fna&oh=00_AT9qWmsv9I7tG3asX2jLyDGFsIXWsNu5SIjwbQPmN0wBjg&oe=62DD2903',
    //         message : "This is a cool caption",
    //         timestamp : "20 July 2022",
    //         username : "@rayush333",
    //         imageUrl : "https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
    //     },
    //     {
    //         profilePic : 'https://scontent.fixe1-3.fna.fbcdn.net/v/t39.30808-6/236141644_1871936996317441_4656979580538207354_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=XjopkA4E0RUAX-tHxqI&_nc_ht=scontent.fixe1-3.fna&oh=00_AT9qWmsv9I7tG3asX2jLyDGFsIXWsNu5SIjwbQPmN0wBjg&oe=62DD2903',
    //         message : "This is a cool caption",
    //         timestamp : "20 July 2022",
    //         username : "@rayush333",
    //         imageUrl : "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
    //     },
    //     {
    //         profilePic : 'https://scontent.fixe1-3.fna.fbcdn.net/v/t39.30808-6/236141644_1871936996317441_4656979580538207354_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=XjopkA4E0RUAX-tHxqI&_nc_ht=scontent.fixe1-3.fna&oh=00_AT9qWmsv9I7tG3asX2jLyDGFsIXWsNu5SIjwbQPmN0wBjg&oe=62DD2903',
    //         message : "This is a cool caption",
    //         timestamp : "20 July 2022",
    //         username : "@rayush333",
    //         imageUrl : "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
    //     }]
    // }
};
export const actionTypes = {
    SET_USER: "SET_USER",
    SET_PROFILE_PIC: "SET_PROFILE_PIC"
};
const reducer = (state,action) => {
    switch(action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user
            };
        case actionTypes.SET_PROFILE_PIC:
            return {
                ...state,
                profilePic : action.profilePic
            }
        default: return state;    
    }
};
export default reducer;