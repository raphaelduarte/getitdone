const getInitials = (str) => {
    if (!str) {
        str = user.displayName
    }
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');
}

export default getInitials