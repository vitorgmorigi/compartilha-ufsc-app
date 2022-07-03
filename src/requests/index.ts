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