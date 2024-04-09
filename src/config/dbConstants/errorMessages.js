const DB_ERROR_MESSAGES = {
  existent_employment_status: 'El tipo de situación laboral ingresada es inválida',
  existent_it_field: 'El área de especialidad ingresada es inválida',
  existent_pronoun: 'El pronombre ingresado es inválido',
  existent_country: 'El país ingresado es inválido',
  unique_user_email: 'El correo electrónico ingresado ya existe',
  unique_user_username: 'El nombre de usuario ingresado ya existe',
  min_allowed_age: 'Debes tener al menos 17 años para registrarse',
  unique_post_category: 'La categoría de publicación ingresa ya existe',
  existent_parent_comment: 'El comentario al que intentas responder no existe',
  existent_post_id: 'La publicación indicada no existe',
  existent_aspect_author: 'Necesitas una cuenta para publicar',
  existent_aspect_category: 'La categoría ingresada no existe',
  unique_post_title: 'El título de la publicación ya existe',
  existent_aspect: 'La publicación o comentario no existe',
  existent_user: 'El usuario no existe',
  valid_vote_direction_value: 'El valor de voteDirection debe ser 1 o -1',
  existent_report_author: 'Necesitas una cuenta para hacer reportes',
  existent_report_reason: 'El motivo del reporte es inválido',
  existent_report_action: 'La acción escogida para el reporte es inválida',
  existent_report: 'El reporte indicado no existe',
  existent_reported_aspect: 'La publicación o el comentario que intentas reportar no existe',
  existent_reported_user: 'El usuario que intentar reportar no existe'
}

export { DB_ERROR_MESSAGES }
