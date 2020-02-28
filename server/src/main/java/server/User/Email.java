package server.User;

import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.*;

public class Email{
	public String recipientEmail;
	public String userName;

	public Email(String recipientEmail, String userName)
	{
		this.recipientEmail = recipientEmail;
		this.userName = userName;
	}

	public String sendEmail(int flag)
	{
		String to = this.recipientEmail;
		String from = "nickleuer24@gmail.com";
		
		Properties properties = new Properties();
		properties.put("mail.transport.protocol", "smtp");
		properties.put("mail.smtp.host", "smtp.leuer.com");
		properties.put("mail.smtp.port", "587");
		properties.put("mail.smtp.user", "nick@leuer.com");
		properties.put("mail.smpt.user", "**22Pokemonn");
		properties.put("mail.smpt.auth", "true");


		Session session = Session.getDefaultInstance(properties);

		try{
			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(from));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

			//Fix message and subject
			if ( flag == 1 ) { //If 'forgot password'
				message.setSubject("Forgot Username/Password");
				message.setText("Username: " + userName);
			} else { //If 'forgot password'
				message.setSubject("Forgot Username/Password");
				message.setText("Username: " + userName + "\n --link here--" );
			}
			//^
			Transport.send(message, "nick@leuer.com", "**22Pokemonn");

			System.out.println("Sent message successfully");
			
			return "{ \"Status\" : \"OK\" }";
		}catch(MessagingException mex){
			mex.printStackTrace();
			return "{ \"status\" : \"Error: Email failed to send.\" }";
		}
	}
}