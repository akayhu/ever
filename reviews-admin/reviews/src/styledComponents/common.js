import styled from "vue-styled-components";

const VotedVotes = styled.div`
  background: linear-gradient(
    to right,
    #ffefdf ${props => `${props.theme.pa}%`},
    #fff 0%
  );
  background: -moz-linear-gradient(
    to right,
    #ffefdf ${props => `${props.theme.pa}%`},
    #fff 0%
  );
  background: -webkit-linear-gradient(
    to right,
    #ffefdf ${props => `${props.theme.pa}%`},
    #fff 0%
  );
  background: -o-linear-gradient(
    to right,
    #ffefdf ${props => `${props.theme.pa}%`},
    #fff 0%
  );
`;

export { VotedVotes };
