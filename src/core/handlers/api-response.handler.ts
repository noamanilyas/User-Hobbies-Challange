export function successResponse(res, body) {
  return res.json({
    status: true,
    result: body,
    error: false,
  });
}

export function errorResponse(res, err) {
  return res.status(!err["status"] ? 500 : err["status"]).json({
    status: false,
    result: false,
    error: {
      type: err.name,
      message: err.message,
    },
  });
}
