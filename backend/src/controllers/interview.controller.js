import interviewService from "../services/interview.service.js";

export const getQuestions = async (req, res) => {
    try {
        const { phase, data } = req.body;

        const questions =
            await interviewService.generateInterviewQuestions(
                phase,
                data
            );

        res.status(200).json({ questions });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};