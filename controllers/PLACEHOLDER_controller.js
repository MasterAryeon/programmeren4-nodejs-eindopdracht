/*
    PLACEHOLDER_controller.js   -   Controller for the requests
 */


//CONTENT PLACEHOLDER
let placeHolder = 'This is a placeholder for the upcoming content';

module.exports = {

    getPLACEHOLDER(req, res, next){
        console.log('---------------A GET request was made---------------');
        console.log('------------------GET PLACEHOLDER-------------------');
        res.status(200).json(placeHolder).end(); //Response to the GET request
    },
}


;