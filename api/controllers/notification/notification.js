const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//create jobprovideronly
const createNotification = async (req, res) => {
  const { userId, message } = req.body;
  try {
    const user = await prisma.user.findMany({ where: { id: Number(id) } });

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const createnotification = await prisma.notification.create({
      data: {
        user_id: userId,
        message,
      },
    });
    res.status(200).send(createnotification);
  } catch (error) {
    res.status(400).json({ error: message });
  }
};

//view notification for authenticated user
const getNotification = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: "desc" },
    });
    res.status(200).send(notifications);
  } catch (error) {
    res.status(400).json({ error: message });
  }
};

// Mark a notification as read router.patch("/notifications/:id/read", 
 const marknotification=async(req, res) => {
  const notificationId = parseInt(req.params.id);
  try {
    // Update the notification's "read" status to true
    const notification = await prisma.notification.update({
      where: { id: notificationId, user_id: req.user.id }, 
      data: { read: true },
    });

    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({ error: message });
  }
};
