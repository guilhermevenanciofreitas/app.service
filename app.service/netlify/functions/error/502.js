export async function handler(event, context) {
    return {
        statusCode: 502,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            erros: ['Erro teste']
        })
    };
}