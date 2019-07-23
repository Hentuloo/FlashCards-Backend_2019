const validator = require('validator');

const validBodyValues = props => {
    const keys = Object.keys(props);
    const validResponse = keys.map(key => {
        if (props[key] === undefined)
            return {
                error: 'Data is wrong',
                status: 'failure',
                errorType: 'dataWrong',
                props,
            };

        switch (key) {
            case 'id':
            case 'idType':
            case 'idWord': {
                if (validator.isEmpty(props[key])) {
                    return {
                        error: 'Data is incomplete',
                        status: 'id is empty',
                        errorType: 'idEmpty',
                        props,
                    };
                } else if (!validator.isAlphanumeric(props[key])) {
                    return {
                        error: 'id is wrong (only alpha-numeric)',
                        status: 'failure',
                        errorType: 'idAlpaNum',
                        props,
                    };
                } else {
                    return true;
                }
            }

            case 'title': {
                if (validator.isEmpty(props[key])) {
                    return {
                        error: 'Data is incomplete',
                        status: 'title is empty',
                        errorType: 'titleEmpty',
                        props,
                    };
                } else if (props[key].length > 15 || props[key].length < 3) {
                    return {
                        error: 'Data is too short or too long',
                        status: 'failure',
                        errorType: 'titleCharactersNumber',
                        props,
                    };
                } else if (/[^\p{L}A-Za-z\d\s]/.test(props[key])) {
                    return {
                        error: 'title is wrong (only alpha-numeric)',
                        status: 'failure',
                        errorType: 'titleAlpaNum',
                        props,
                    };
                } else {
                    return true;
                }
            }

            case 'icon': {
                if (validator.isEmpty(props[key])) {
                    return {
                        error: 'Data is incomplete',
                        status: 'icon is empty',
                        errorType: 'iconEmpty',
                        props,
                    };
                } else if (!/^[a-z0-9_-]+$/i.test(props[key])) {
                    return {
                        error: 'icon is wrong (only alpha-numeric',
                        status: 'failure',
                        errorType: 'iconAlpaNum',
                        props,
                    };
                } else {
                    return true;
                }
            }

            case 'cards': {
                for (i = 0; i < props[key].length; i++) {
                    const { word, description } = props[key][i];
                    if (
                        word.length > 60 ||
                        description.length > 60 ||
                        word.length < 3 ||
                        description.length < 3
                    )
                        return {
                            error: 'Data is too short or too long',
                            status: 'failure',
                            errorType: 'cardCharactersNumber',
                            props,
                        };
                    if (
                        validator.isEmpty(word) ||
                        validator.isEmpty(description)
                    ) {
                        return {
                            error: 'Data is incomplete',
                            status: 'failure',
                            errorType: 'cardEmpty',
                            props,
                        };
                    } else if (
                        /^[\s\d\p{L}()[\] ,.!?/|:"']+$/i.test(word) ||
                        /^[\s\d\p{L}()[\] ,.!?/|:"']+$/i.test(description)
                    ) {
                        return {
                            error: 'Data is wrong (only alpha-numeric)',
                            status: 'failure',
                            errorType: 'cardAlpaNum',
                            props,
                        };
                    } else {
                        return true;
                    }
                }
            }

            case 'email': {
                if (!validator.isEmail(props[key])) {
                    return {
                        error: 'Email field is wrong',
                        status: 'failure',
                        errorType: 'emailWrong',
                        props,
                    };
                } else {
                    return true;
                }
            }
            case 'password': {
                if (validator.isEmpty(props[key])) {
                    return {
                        error: 'password field is wrong',
                        status: 'failure',
                        errorType: 'passwordEmpty',
                        props,
                    };
                }
                break;
            }
        }
    });
    return validResponse.find(e => typeof e === 'object');
};

module.exports = validBodyValues;
