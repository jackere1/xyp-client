const standardizedResponse = (data: any, errorMessage: string | null, code: number) => {
  return {
    code,
    data,
    errorMessage,
    timestamp: Date.now()
  }
}

export { standardizedResponse };