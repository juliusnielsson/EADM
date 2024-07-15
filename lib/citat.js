const citater = [
    "Okay, så skal jeg bare have en ristet i svøb - Theo",
    "Findes der kloakker der går op ad? - Julius",
    "Du tager en body-tequila fra en død mands mellemkød - Jonas",
]

exports.getCitat = () => {
    const idx =
   Math.floor(Math.random()*citater.length)
    return citater[idx]
   }