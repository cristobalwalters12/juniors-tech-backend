import { getPostReports, getCommentReports, getUserReports } from '../models/reportModel.js'

const getPostTypeReports = async (req, res) => {
  const data = await getPostReports()
  res.status(200).json({
    status: 'success',
    data
  })
}

const getCommentTypeReports = async (req, res) => {
  const data = await getCommentReports()
  res.status(200).json({
    status: 'success',
    data
  })
}

const getUserTypeReports = async (req, res) => {
  const data = await getUserReports()
  res.status(200).json({
    status: 'success',
    data
  })
}

export { getPostTypeReports, getCommentTypeReports, getUserTypeReports }
