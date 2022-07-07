export function getToken(authorizationCode: string) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    }
  };

  return fetch(`https://us-central1-compartilha-ufsc.cloudfunctions.net/api/token?code=${authorizationCode}`, options);
}

export function getProfile(token: string) {
  const options = {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json;charset=UTF-8",
    }
  };

  return fetch(`https://us-central1-compartilha-ufsc.cloudfunctions.net/api/login`, options);
}

export function joinInAPrivateCircle(token: string, circleId: string, typedPassword: string) {
    const options: RequestInit = {
        method: "POST",
        headers: {
            Authorization: token,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
            circle_id: circleId,
            circle_password: typedPassword
        })
        };

        return fetch(`https://us-central1-compartilha-ufsc.cloudfunctions.net/api/user/circle`, options);
}

export function listCategories(token: string) {
  const options = {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json;charset=UTF-8",
      }
    };

    return fetch(`https://us-central1-compartilha-ufsc.cloudfunctions.net/api/category`, options);
}


export function listCircles(token: string) {
    const options = {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json;charset=UTF-8",
        }
      };
  
      return fetch(`https://us-central1-compartilha-ufsc.cloudfunctions.net/api/circle`, options);
}

export function listFeed(token: string, searchAttributes?: Partial<{ itemName: string, categoryIds: string}>) {
    const options = {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json;charset=UTF-8",
        }
      };
  
      const requestURL = `https://us-central1-compartilha-ufsc.cloudfunctions.net/api/feed?`;

      if (searchAttributes?.categoryIds) {
        requestURL.concat(`categoryIds=${searchAttributes?.categoryIds}`)
      }

      if (searchAttributes?.itemName) {
        requestURL.concat(`itemName=${searchAttributes?.itemName}`)
      }

      return fetch(requestURL, options);
}

export function listItemsInACircle(token: string, circleId: string, searchAttributes?: Partial<{ itemName: string, categoryIds: string}>) {
    const options = {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json;charset=UTF-8",
        }
      };
  
      const requestURL = `https://us-central1-compartilha-ufsc.cloudfunctions.net/api/feed?circles=${circleId}`;

      if (searchAttributes?.categoryIds) {
        requestURL.concat(`categoryIds=${searchAttributes?.categoryIds}`)
      }

      if (searchAttributes?.itemName) {
        requestURL.concat(`itemName=${searchAttributes?.itemName}`)
      }

      return fetch(requestURL, options);
}

export function listItemDetails(token: string, itemId: string) {
    const options = {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json;charset=UTF-8",
        }
      };
  
      return fetch(`https://us-central1-compartilha-ufsc.cloudfunctions.net/api/item/${itemId}`, options);
}