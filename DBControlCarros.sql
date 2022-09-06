/*drop database FlotillaDB;*/
CREATE DATABASE FlotillaDB;
USE FlotillaDB;


CREATE TABLE Cliente(
	id int not null auto_increment,
    nombre varchar (50),
    telefono varchar(50),
    primary key pk_idUser (id)
);

CREATE TABLE Estado(
	id_estado int not null auto_increment,
    nombre_estado varchar(50),
    primary key pk_idEstado (id_estado)
);

CREATE TABLE Carros(
	marca varchar (50),
    modelo varchar (50),
    año datetime,
    placa varchar (30),
    estado int,
    cliente int,
    primary key pk_placa (placa), 
    constraint FK_estado foreign key (estado) references Estado(id_estado),
    constraint FK_cliente foreign key (cliente) references Cliente(id)
);


/*
delimiter $$
	create procedure sp_AgregarCliente(
		in id int,
        in nombre_estado varchar(50),
        in telefono varchar(50)
        )
        Begin 
			Insert into Cliente(id, nombre, telefono)
				values(id, nombre, telefono);
		End$$
delimiter ;

call sp_AgregarCliente(01,"Alejandro","32854800");
call sp_AgregarCliente(02,"Miguel","47251425");
call sp_AgregarCliente(03,"Gerardo","96584736");
call sp_AgregarCliente(04,"Jairo","41583625");
call sp_AgregarCliente(05,"Elsa","52021400");

delimiter $$
	create procedure sp_AgregarEstado(
		in id_estado int,
        in nombre_estado varchar(50)
        )
        Begin 
			Insert into Estado(id_estado, nombre_estado)
				values(id_estado, nombre_estado);
		End$$
delimiter ;

call sp_AgregarEstado(01,"Perfecto");
call sp_AgregarEstado(02,"Daño menor");
call sp_AgregarEstado(03,"Reparación urgente");
call sp_AgregarEstado(04,"En reparación");
call sp_AgregarEstado(05,"Descarte");

delimiter $$
	create procedure sp_AgregarCarro(
		in	marca varchar (50),
		in	modelo varchar (50),
		in	año datetime,
		in	placa varchar (30),
		in	estado int,
		in	cliente int
        )
        Begin 
			Insert into Carros(marca, modelo, año,placa,estado, cliente)
				values(marca, modelo, año,placa,estado, cliente);
		End$$
delimiter ;

call sp_AgregarCarro("Mercedes Benz","Camioneta Tipo G","2022/04/18","P-ABC123",1,1);
call sp_AgregarCarro("Mercedes","Camioneta","2000/03/19","A-ABC456",2,2);
call sp_AgregarCarro("Honda","Carro de carrera","2024/04/21","G-ABC789",3,3);
call sp_AgregarCarro("Mini","Mini Cuper","2012/08/06","J-ABC987",4,4);
call sp_AgregarCarro("Toyota","Pick Up","1850/04/30","B-ABC654",5,5);

SELECT * FROM Carros*/



