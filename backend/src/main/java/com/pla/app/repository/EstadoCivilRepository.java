package com.pla.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.pla.app.model.EstadoCivil;
import com.pla.app.dto.estadosciviles.EstadoCivilOptionProjection;

@Repository
public interface EstadoCivilRepository extends JpaRepository<EstadoCivil, Long> {

	@Query("select e.id as id, e.nombre as nombre from EstadoCivil e order by e.nombre asc")
	List<EstadoCivilOptionProjection> findAllOptions();
}


