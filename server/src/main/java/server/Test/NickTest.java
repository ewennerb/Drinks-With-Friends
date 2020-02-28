package server.Test;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import server.SQL.UserSQL;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;



@RestController
@RequestMapping(path="/NickTest")
public class NickTest {
	@GetMapping("")
	public String NickTest(){
		return "WORKS";
	}

}