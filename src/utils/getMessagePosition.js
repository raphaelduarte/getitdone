const getMessagePosition = (author, userUid) => {
    if (author === userUid) {
        return "ml-auto bg-primary/90 text-secondary"
    }
    else {
        return "mr-auto bg-foreground/90 text-secondary"
    }
}

export default getMessagePosition